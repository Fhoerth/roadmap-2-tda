import { StatusCodes } from 'http-status-codes';

import { sleep } from '../../../../common/utils/sleep';
import { DeferredTimeoutPromise } from '../../DeferredTimeoutPromise';
import {
  SingleTaskProcessor,
  TaskWithTimeout,
} from '../../SingleTaskProcessor';
import type { Browser } from '../Browser';
import type { ProcessService } from '../ProcessService';
import { LeetCodeError } from '../errors/LeetCodeError';
import { LoginRequiredError } from '../errors/LoginRequiredError';
import { SubmissionNotFoundError } from '../errors/SubmissionNotFoundError';
import type { ProblemSlug } from '../types/ProblemSlug';
import type { SourceCodeResult } from '../types/SourceCodeResult';
import type { StatisticsResult } from '../types/StatisticsResult';
import type { Submission } from '../types/Submission';
import type { SubmissionId } from '../types/SubmissionId';
import { extractProblemSlug } from '../utils/extractProblemSlug';
import { extractSourceCode } from '../utils/extractSourceCode';
import { extractStatistics } from '../utils/extractStatistics';
import { BrowserTasks } from './BrowserTasks';
import { LoginTasks } from './LoginTasks';

class LeetCodeTasks {
  readonly #browser: Browser;
  readonly #taskProcessor: SingleTaskProcessor<void | Submission>;
  readonly #processService: ProcessService;
  readonly #browserTasks: BrowserTasks;
  readonly #loginTasks: LoginTasks;

  constructor(
    browser: Browser,
    taskProcessor: SingleTaskProcessor<void | Submission>,
    processService: ProcessService,
    browserTasks: BrowserTasks,
    loginTasks: LoginTasks,
  ) {
    this.#browser = browser;
    this.#taskProcessor = taskProcessor;
    this.#processService = processService;
    this.#browserTasks = browserTasks;
    this.#loginTasks = loginTasks;
  }

  async #getSourceCodeResult(
    submissionId: string,
    timeoutPromise: DeferredTimeoutPromise,
  ): Promise<SourceCodeResult> {
    await this.#browserTasks.checkBrowserAlive(timeoutPromise);
    timeoutPromise.reset();

    const browser = await this.#browser.getBrowser();
    const submissionDetailUrl = `https://leetcode.com/submissions/detail/${submissionId}/`;

    const submissionPage = await browser.newPage();
    await submissionPage.bringToFront();
    timeoutPromise.reset();

    const response = await submissionPage.goto(submissionDetailUrl, {
      waitUntil: 'networkidle0',
    });

    if (submissionPage.url().includes('login')) {
      await submissionPage.close();
      throw new LoginRequiredError();
    }

    timeoutPromise.reset();

    if (
      !response ||
      (response.status() !== StatusCodes.OK &&
        response.status() !== StatusCodes.NOT_FOUND)
    ) {
      await submissionPage.close();
      throw new LeetCodeError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Cannot fetch submission ${submissionId} statistics.`,
      );
    }

    if (response.status() === StatusCodes.NOT_FOUND) {
      await submissionPage.close();
      throw new LeetCodeError(
        StatusCodes.NOT_FOUND,
        `Submission ${submissionId} not found.`,
      );
    }

    const content = await response.text();
    timeoutPromise.reset();

    const problemSlug = extractProblemSlug(content);
    const sourceCode = extractSourceCode(content);

    await submissionPage.close();

    timeoutPromise.reset();

    return { problemSlug, sourceCode };
  }

  async #getStatisticsResult(
    slug: ProblemSlug,
    submissionId: SubmissionId,
    timeoutPromise: DeferredTimeoutPromise,
  ): Promise<StatisticsResult> {
    await this.#browserTasks.checkBrowserAlive(timeoutPromise);
    timeoutPromise.reset();

    const browser = await this.#browser.getBrowser();
    const problemStatisticsUrl = `https://leetcode.com/problems/${slug}/submissions/${submissionId}/`;

    const statisticsPage = await browser.newPage();
    await statisticsPage.bringToFront();
    await statisticsPage.setViewport({
      width: 1280,
      height: 1024,
    });
    await statisticsPage.evaluateOnNewDocument(() => {
      localStorage.setItem('lc-theme', 'dark');
    });
    timeoutPromise.reset();

    const response = await statisticsPage.goto(problemStatisticsUrl, {
      waitUntil: 'domcontentloaded',
    });
    timeoutPromise.reset();

    if (
      !response ||
      (response.status() !== StatusCodes.OK &&
        response.status() !== StatusCodes.NOT_FOUND)
    ) {
      await statisticsPage.close();
      throw new LeetCodeError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Cannot fetch submission ${submissionId} statistics.`,
      );
    }

    if (response.status() === StatusCodes.NOT_FOUND) {
      await statisticsPage.close();
      throw new LeetCodeError(
        StatusCodes.NOT_FOUND,
        `Submission ${submissionId} not found.`,
      );
    }

    await sleep(2_500);
    timeoutPromise.reset();

    const statistics = await extractStatistics(submissionId, statisticsPage);

    await sleep(2_500);
    await statisticsPage.close();

    timeoutPromise.reset();

    return statistics;
  }

  async #enqueueFetchSumissionTask(submissionId: string): Promise<Submission> {
    const solver = async (timeoutPromise: DeferredTimeoutPromise) => {
      const sourceCodeResult = await this.#getSourceCodeResult(
        submissionId,
        timeoutPromise,
      );
      timeoutPromise.reset();

      const statisticsResult = await this.#getStatisticsResult(
        sourceCodeResult.problemSlug,
        submissionId,
        timeoutPromise,
      );
      timeoutPromise.resolve();

      return {
        ...sourceCodeResult,
        ...statisticsResult,
      };
    };

    const task = this.#taskProcessor.enqueueTaskWithTimeout(
      `fetch_submission_${submissionId}`,
      solver,
      20_000,
    ) as TaskWithTimeout<Submission>;

    return task.waitForPromise();
  }

  public async enqueueFetchSumissionTask(
    submissionId: string,
  ): Promise<Submission> {
    try {
      return await this.#enqueueFetchSumissionTask(submissionId);
    } catch (error) {
      if (error instanceof LoginRequiredError) {
        await this.#loginTasks.enqueuePerformLoginTask();
        return this.enqueueFetchSumissionTask(submissionId);
      }

      if (!(error instanceof SubmissionNotFoundError)) {
        this.#processService.terminate(error);
      }

      throw error;
    }
  }
}

export { LeetCodeTasks };

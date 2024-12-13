import { StatusCodes } from 'http-status-codes';
import type { Page } from 'rebrowser-puppeteer-core';

import { assert } from '../../../common/utils/assert';
import { DeferredPromise } from '../DeferredPromise';
import { CookieService } from './CookieService';
import { ForeverBrowser } from './ForeverBrowser';
import { LoginService } from './LoginService';
import { LeetCodeError } from './errors/LeetCodeError';
import type { ProblemSlug } from './types/ProblemSlug';
import type { SourceCodeResult } from './types/SourceCodeResult';
import type { StatisticsResult } from './types/StatisticsResult';
import type { Submission } from './types/Submission';
import type { SubmissionId } from './types/SubmissionId';
import { extractProblemSlug } from './utils/extractProblemSlug';
// import { DeferredTimeoutPromise } from '../DeferredTimeoutPromise';
// import { SingleTaskProcessor } from '../SingleTaskProcessor';
import { extractProfileName } from './utils/extractProfileName';
import { extractSourceCode } from './utils/extractSourceCode';
import { extractStatistics } from './utils/extractStatistics';

class Scrapper {
  #cookieService: CookieService | null;
  #loginService: LoginService | null;
  #foreverBrowser: ForeverBrowser;

  #isFirstLaunch: boolean;
  #performingLoginCheck: boolean;
  #waitForLoginCheck: DeferredPromise<void>;
  #waitForStatusOK: DeferredPromise<void>;

  constructor() {
    this.#cookieService = null;
    this.#loginService = null;
    this.#foreverBrowser = new ForeverBrowser();

    this.#isFirstLaunch = true;
    this.#performingLoginCheck = false;

    console.log(this.#performingLoginCheck);

    this.#waitForLoginCheck = new DeferredPromise<void>();
    this.#waitForStatusOK = new DeferredPromise<void>();

    this.#foreverBrowser.launchForever(async () => {
      if (!this.#isFirstLaunch) {
        this.#waitForStatusOK.reset();
        this.#waitForLoginCheck.reset();
      }

      this.#isFirstLaunch = false;
      this.#loginService = new LoginService();
      this.#cookieService = new CookieService();

      const browser = this.#foreverBrowser.getBrowser();

      this.#cookieService.setBrowser(browser);
      this.#cookieService.loadCookies();

      const mainGitHubPage = await browser.newPage();
      const mainLeetCodePage = await browser.newPage();
      await mainLeetCodePage.evaluateOnNewDocument(() => {
        localStorage.setItem('lc-theme', 'dark');
      });

      this.#loginService.setMainGitHubPage(mainGitHubPage);
      this.#loginService.setMainLeetCodePage(mainLeetCodePage);

      await this.#performLogin();

      console.log('Browser is ready to receive requests');
      console.log('GitHub login: OK!');
      console.log('LeetCode login: OK!');
      console.log('====================================');

      this.#performingLoginCheck = false;
      this.#waitForStatusOK.resolve();
    });
  }

  #getCookieService(): CookieService {
    return assert(this.#cookieService);
  }

  #getLoginService(): LoginService {
    return assert(this.#loginService);
  }

  async #patientlyWaitForStatusOK(): Promise<void> {
    try {
      await this.#waitForStatusOK.waitForPromise();
    } catch (_) {
      return this.#patientlyWaitForStatusOK();
    }
  }

  async #getSourceCodeResult(
    submissionId: string,
    submissionPage: Page,
  ): Promise<SourceCodeResult> {
    const submissionDetailUrl = `https://leetcode.com/submissions/detail/${submissionId}/`;
    const response = await submissionPage.goto(submissionDetailUrl, {
      waitUntil: 'networkidle2',
    });

    if (!response) {
      await submissionPage.close();

      throw new LeetCodeError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Submission ${submissionId} not found`,
      );
    }

    if (response.status() === 404) {
      await submissionPage.close();

      throw new LeetCodeError(
        StatusCodes.NOT_FOUND,
        `Submission ${submissionId} not found`,
      );
    }

    if (response.status() !== 200) {
      await submissionPage.close();

      throw new LeetCodeError(
        response.status(),
        `Error while fetching submission ${submissionId}`,
      );
    }

    const content = await response.text();
    const problemSlug = extractProblemSlug(content);
    const profileName = extractProfileName(content);
    const sourceCode = extractSourceCode(content);

    return { profileName, problemSlug, sourceCode };
  }

  async #getStatisticsResult(
    slug: ProblemSlug,
    submissionId: SubmissionId,
    statisticsPage: Page,
  ): Promise<StatisticsResult> {
    const problemStatisticsUrl = `https://leetcode.com/problems/${slug}/submissions/${submissionId}/`;
    await statisticsPage.goto(problemStatisticsUrl, {
      waitUntil: 'domcontentloaded',
    });
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const statistics = await extractStatistics(submissionId, statisticsPage);

    return statistics;
  }

  async #processSubmissionWithoutTimeout(
    submissionId: SubmissionId,
  ): Promise<Submission> {
    // Source Code
    const browser = this.#foreverBrowser.getBrowser();
    const submissionPage = await browser.newPage();
    await submissionPage.bringToFront();

    let sourceCodeResult: SourceCodeResult;
    try {
      sourceCodeResult = await this.#getSourceCodeResult(
        submissionId,
        submissionPage,
      );
    } finally {
      await submissionPage.close();
    }
    sourceCodeResult = assert(sourceCodeResult);

    // Statistics
    const { problemSlug } = sourceCodeResult;
    const statisticsPage = await browser.newPage();
    await statisticsPage.setViewport({
      width: 1280,
      height: 1024,
    });
    await statisticsPage.bringToFront();

    let statisticsResult: StatisticsResult;
    try {
      statisticsResult = await this.#getStatisticsResult(
        problemSlug,
        submissionId,
        statisticsPage,
      );
    } finally {
      await statisticsPage.close();
    }
    sourceCodeResult = assert(sourceCodeResult);

    return {
      ...sourceCodeResult,
      ...statisticsResult,
    };
  }

  async #processSubmission(submissionId: SubmissionId): Promise<Submission> {
    return this.#processSubmissionWithoutTimeout(submissionId);
  }

  async #performLogin(): Promise<void> {
    try {
      this.#performingLoginCheck = true;

      await this.#getLoginService().performLogin();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await this.#getCookieService().saveCookies();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.#waitForLoginCheck.resolve();
      this.#performingLoginCheck = false;
    } catch (reason) {
      let error: Error;

      if (reason instanceof Error) {
        error = reason;
      } else {
        error = new Error('#performLogin not successful');
      }

      this.#waitForLoginCheck.reject(error);
      throw error;
    }
  }

  public async halt(): Promise<void> {
    return this.#foreverBrowser.halt();
  }

  public async fetchSubmission(
    submissionId: SubmissionId,
  ): Promise<Submission> {
    await this.#patientlyWaitForStatusOK();
    return this.#processSubmission(submissionId);
  }
}

export { Scrapper };

import { assert } from '../../../common/utils/assert';
import { CookieService } from '../CookieService';
import { DeferredPromise } from '../DeferredPromise';
import { ForeverBrowser } from '../ForeverBrowser';
import { LoginService } from './LoginService';
// import { changeToDarkTheme } from './utils/changeToDarkTheme';
import { extractSlug } from './utils/extractSlugs';
import { extractSourceCode } from './utils/extractSourceCode';
// import { DeferredTimeoutPromise } from '../DeferredTimeoutPromise';
// import { SingleTaskProcessor } from '../SingleTaskProcessor';
import { extractStatistics } from './utils/extractStatistics';
import type { Statistics } from './utils/extractStatistics';

type SubmissionId = string;
type Submission = Statistics & {
  code: string;
};

class Scrapper {
  #cookieService: CookieService | null;
  #loginService: LoginService | null;
  #foreverBrowser: ForeverBrowser;
  #submissions: Map<SubmissionId, Submission>;

  #isFirstLaunch: boolean;
  #performingLoginCheck: boolean;
  #waitForLoginCheck: DeferredPromise<void>;
  #waitForStatusOK: DeferredPromise<void>;

  constructor() {
    this.#cookieService = null;
    this.#loginService = null;
    this.#foreverBrowser = new ForeverBrowser();
    this.#submissions = new Map();

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

  async #processSubmissionWihtoutTimeout(
    submissionId: SubmissionId,
  ): Promise<Submission> {
    if (this.#submissions.has(submissionId)) {
      return this.#submissions.get(submissionId)!;
    }

    const submissionDetailUrl = `https://leetcode.com/submissions/detail/${submissionId}/`;
    const generateProblemStatisticsUrl = (slug: string): string =>
      `https://leetcode.com/problems/${slug}/submissions/${submissionId}/`;

    const browser = this.#foreverBrowser.getBrowser();
    const submissionPage = await browser.newPage();

    await submissionPage.bringToFront();
    const response = await submissionPage.goto(
      `https://leetcode.com/submissions/detail/${submissionId}/`,
      { waitUntil: 'networkidle2' },
    );

    if (response) {
      const content = await response.text();
      const slug = extractSlug(content);
      const sourceCode = extractSourceCode(content);
      const problemStatisticsUrl = generateProblemStatisticsUrl(slug);

      const statisticsPage = await browser.newPage();
      await statisticsPage.setViewport({
        width: 1280,
        height: 1024,
      });
      await statisticsPage.bringToFront();
      await statisticsPage.goto(problemStatisticsUrl, {
        waitUntil: 'domcontentloaded',
      });
      await new Promise((resolve) => setTimeout(resolve, 2500));
      console.log('Resolved!');
      const statistics = await extractStatistics(submissionId, statisticsPage);
      const submission = {
        ...statistics,
        code: sourceCode,
      };

      this.#submissions.set(submissionId, submission);
      await submissionPage.close();
      return submission;
    } else {
      await submissionPage.close();
      throw new Error(`No response for url: ${submissionDetailUrl}`);
    }
  }

  async #processSubmission(submissionId: SubmissionId): Promise<Submission> {
    return this.#processSubmissionWihtoutTimeout(submissionId);
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

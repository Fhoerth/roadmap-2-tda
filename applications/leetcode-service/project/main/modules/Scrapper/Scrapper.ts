import path from 'path';

import { assert } from '../../../common/utils/assert';
import { env } from '../../env';
import { CookieService } from '../CookieService';
import { DeferredPromise } from '../DeferredPromise';
import { ForeverBrowser } from '../ForeverBrowser';
import { SingleTaskProcessor } from '../SingleTaskProcessor';
import { LoginService } from './LoginService';
import { captureElementScreenshot } from './utils/captureScreenshot';
import { extractSlug } from './utils/extractSlugs';

// import { searchByText } from './utils/searchByText';

type SubmissionId = string;
type Submission = {
  id: SubmissionId;
  code: string;
};
const a: Submission = { id: '123', code: 'asd' };

console.log(SingleTaskProcessor, a);

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

  async #processSubmission(submissionId: SubmissionId): Promise<Submission> {
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
      const problemStatisticsUrl = generateProblemStatisticsUrl(slug);

      const statisticsPage = await browser.newPage();
      await statisticsPage.setViewport({
        width: 1280,
        height: 1024,
      });
      await statisticsPage.bringToFront();
      await statisticsPage.goto(problemStatisticsUrl, {
        waitUntil: 'networkidle2',
      });
      const screenshotOutputPath = path.join(
        env.LEETCODE_SERVICE_VIDEO_DIR,
        `statistics-${submissionId}.png`,
      );
      const elementHandle = assert(await statisticsPage.$('body'));
      await captureElementScreenshot(elementHandle, screenshotOutputPath);

      const submission: Submission = {
        id: submissionId,
        code: content,
      };

      // await statisticsPage.close();
      // await submissionPage.close();

      return submission;
    } else {
      await submissionPage.close();
      throw new Error(`No response for url: ${submissionDetailUrl}`);
    }
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

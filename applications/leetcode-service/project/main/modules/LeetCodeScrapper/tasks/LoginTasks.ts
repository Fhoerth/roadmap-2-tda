import { authenticator } from 'otplib';

import { sleep } from '../../../../common/utils/sleep';
import { env } from '../../../env';
import { DeferredTimeoutPromise } from '../../DeferredTimeoutPromise';
import {
  SingleTaskProcessor,
  TaskWithTimeout,
} from '../../SingleTaskProcessor';
import type { TimeoutSolver } from '../../SingleTaskProcessor';
import { CookieService } from '../CookieService';
import { ForeverBrowser } from '../ForeverBrowser';
import type { ProcessService } from '../ProcessService';
import type { Submission } from '../types/Submission';
import { clickButton } from '../utils/clickButton';
import { BrowserTasks } from './BrowserTasks';

class LoginTasks {
  readonly #foreverBrowser: ForeverBrowser;
  readonly #taskProcessor: SingleTaskProcessor<void | Submission>;

  readonly #processService: ProcessService;
  readonly #browserTasks: BrowserTasks;
  readonly #cookieService: CookieService;

  readonly #leetcodeProfileName: string;
  readonly #gitHubProfileName: string;
  readonly #gitHubUsername: string;
  readonly #gitHubPassword: string;
  readonly #gitHubToptSecret: string;

  constructor(
    foreverBrowser: ForeverBrowser,
    taskProcessor: SingleTaskProcessor<void | Submission>,
    processService: ProcessService,
    browserTasks: BrowserTasks,
    cookieService: CookieService,
  ) {
    this.#foreverBrowser = foreverBrowser;
    this.#taskProcessor = taskProcessor;

    this.#processService = processService;
    this.#browserTasks = browserTasks;
    this.#cookieService = cookieService;

    this.#gitHubUsername = env.GITHUB_USERNAME;
    this.#gitHubPassword = env.GITHUB_PASSWORD;
    this.#gitHubProfileName = env.GITHUB_PROFILE_NAME;
    this.#leetcodeProfileName = env.LEETCODE_PROFILE_NAME;
    this.#gitHubToptSecret = env.GITHUB_TOPT_SECRET;
  }

  #generateTotpCode(): string {
    return authenticator.generate(this.#gitHubToptSecret);
  }

  async #isGitHubLoggedIn(): Promise<boolean> {
    const browser = this.#foreverBrowser.getBrowser();
    const settingsUrl = 'https://github.com/settings';

    try {
      const gitHubPage = await browser.newPage();

      await gitHubPage.bringToFront();
      await gitHubPage.goto(settingsUrl, { waitUntil: 'networkidle2' });

      const content = await gitHubPage.content();

      if (
        content.toLowerCase().includes(this.#gitHubProfileName.toLowerCase())
      ) {
        await gitHubPage.close();
        return true;
      }

      await gitHubPage.close();

      return false;
    } catch (error) {
      return false;
    }
  }

  async #isLeetCodeLoggedIn(): Promise<boolean> {
    const browser = this.#foreverBrowser.getBrowser();
    const profileUrl = 'https://leetcode.com/profile/';
    const loginUrl = 'https://leetcode.com/accounts/github/login/?next=%2F';

    try {
      const profilePage = await browser.newPage();
      const loginPage = await browser.newPage();

      await profilePage.bringToFront();
      // There is a possibility that leetcode redirects to login so
      // the wait for turnstile to be checked
      await profilePage.goto(profileUrl, { waitUntil: 'networkidle0' });
      await loginPage.goto(loginUrl, { waitUntil: 'networkidle0' });

      // Potetially, wait for turnstile to be checked.
      await sleep(4_000);

      const profilePageContent = await profilePage.content();
      const loginPageCOntent = await loginPage.content();

      const content: [string, string] = [
        profilePageContent.toLowerCase(),
        loginPageCOntent.toLowerCase(),
      ];

      if (
        content.some((x) => x.includes(this.#leetcodeProfileName.toLowerCase()))
      ) {
        await profilePage.close();
        await loginPage.close();
        return true;
      }

      await profilePage.close();
      await loginPage.close();

      return false;
    } catch (error) {
      return false;
    }
  }

  async #loginToGitHub(timeoutPromise: DeferredTimeoutPromise): Promise<void> {
    const browser = this.#foreverBrowser.getBrowser();
    const loginUrl = 'https://www.github.com/login';

    const gitHubPage = await browser.newPage();
    timeoutPromise.reset();

    await gitHubPage.bringToFront();
    await gitHubPage.goto(loginUrl, {
      waitUntil: 'networkidle2',
    });
    timeoutPromise.reset();

    // Part 1: Login FORM.
    await gitHubPage.waitForSelector('input[name="login"]', {
      visible: true,
    });
    await gitHubPage.waitForSelector('input[name="password"]', {
      visible: true,
    });
    timeoutPromise.reset();

    // Fill login input
    await gitHubPage.type('input[name="login"]', this.#gitHubUsername, {
      delay: 200,
    });
    timeoutPromise.reset();

    // Fill password input
    await gitHubPage.type('input[name="password"]', this.#gitHubPassword, {
      delay: 200,
    });
    timeoutPromise.reset();

    await clickButton(gitHubPage, 'input[type="submit"]');
    await gitHubPage.waitForNavigation();
    timeoutPromise.reset();

    // Part 2: 2FA (TotpCode)
    await gitHubPage.waitForSelector('#app_totp', {
      visible: true,
    });
    await gitHubPage.type('input[name="app_otp"]', this.#generateTotpCode(), {
      delay: 200,
    });
    timeoutPromise.reset();

    await sleep(1500);
    timeoutPromise.reset();

    await gitHubPage.close();
  }

  async #loginToLeetCode(
    timeoutPromise: DeferredTimeoutPromise,
  ): Promise<void> {
    const browser = this.#foreverBrowser.getBrowser();
    const loginUrl = 'https://leetcode.com/accounts/github/login/?next=%2F';

    const leetCodePage = await browser.newPage();
    timeoutPromise.reset();

    await leetCodePage.bringToFront();
    await leetCodePage.goto(loginUrl, { waitUntil: 'networkidle2' });
    timeoutPromise.reset();

    await sleep(10_000);

    await clickButton(leetCodePage, 'button[type="submit"]');
    await leetCodePage.waitForNavigation({ waitUntil: 'networkidle2' });
    timeoutPromise.reset();

    await leetCodePage.close();
  }

  async #gitHubLogin(timeoutPromise: DeferredTimeoutPromise): Promise<void> {
    console.log('Initialize GitHub login!');

    await this.#browserTasks.checkBrowserAlive(timeoutPromise);
    timeoutPromise.reset();

    const isLoggedIn = await this.#isGitHubLoggedIn();
    timeoutPromise.reset();

    if (!isLoggedIn) {
      await this.#loginToGitHub(timeoutPromise);
      timeoutPromise.reset();
    }

    timeoutPromise.resolve();

    console.log('Login to GitHub finished!');
  }

  async #leetCodeLogin(timeoutPromise: DeferredTimeoutPromise): Promise<void> {
    console.log('Initialize Leet Code login!');

    await this.#browserTasks.checkBrowserAlive(timeoutPromise);
    timeoutPromise.reset();

    const isLoggedIn = await this.#isLeetCodeLoggedIn();
    timeoutPromise.reset();

    if (!isLoggedIn) {
      await this.#loginToLeetCode(timeoutPromise);
      timeoutPromise.reset();
    }

    timeoutPromise.resolve();
    console.log('Login to LeetCode finished!');
  }

  async #enqueuePerformLoginTask(): Promise<void> {
    try {
      const gitHubLoginSolver: TimeoutSolver<void> = async (
        timeoutPromise: DeferredTimeoutPromise,
      ) => {
        return this.#gitHubLogin(timeoutPromise);
      };

      const leetCodeLoginSolver: TimeoutSolver<void> = async (
        timeoutPromise: DeferredTimeoutPromise,
      ) => {
        return this.#leetCodeLogin(timeoutPromise);
      };

      const gitHubLoginTask = this.#taskProcessor.enqueueTaskWithTimeout(
        'github_login',
        gitHubLoginSolver,
        20_000,
      ) as TaskWithTimeout<void>;

      const leetCodeLoginTask = this.#taskProcessor.enqueueTaskWithTimeout(
        'leetcode_login',
        leetCodeLoginSolver,
        20_000,
      ) as TaskWithTimeout<void>;

      await Promise.all([
        gitHubLoginTask.waitForPromise(),
        leetCodeLoginTask.waitForPromise(),
      ]);

      await this.#cookieService.saveCookies();
    } catch (error) {}
  }

  public async enqueuePerformLoginTask(): Promise<void> {
    try {
      await this.#enqueuePerformLoginTask();
    } catch (error) {
      this.#processService.terminate(error);
    }
  }
}

export { LoginTasks };

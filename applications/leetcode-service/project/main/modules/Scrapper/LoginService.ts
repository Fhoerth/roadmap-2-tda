import { authenticator } from 'otplib';
import type { Page } from 'rebrowser-puppeteer-core';

import { assert } from '../../../common/utils/assert';
import { env } from '../../env';

class LoginService {
  #mainLeetCodePage: Page | null;
  #mainGitHubPage: Page | null;

  #leetcodeProfileName: string;
  #gitHubProfileName: string;
  #gitHubUsername: string;
  #gitHubPassword: string;
  #gitHubToptSecret: string;

  constructor() {
    this.#mainLeetCodePage = null;
    this.#mainGitHubPage = null;
    this.#gitHubUsername = env.GITHUB_USERNAME;
    this.#gitHubPassword = env.GITHUB_PASSWORD;
    this.#gitHubProfileName = env.GITHUB_PROFILE_NAME;
    this.#leetcodeProfileName = env.LEETCODE_PROFILE_NAME;
    this.#gitHubToptSecret = env.GITHUB_TOPT_SECRET;
  }

  #generateTotpCode(): string {
    return authenticator.generate(this.#gitHubToptSecret);
  }

  #getMainLeetCodePage(): Page {
    return assert(this.#mainLeetCodePage);
  }

  #getMainGitHubPage(): Page {
    return assert(this.#mainGitHubPage);
  }

  async #clickButton(page: Page, selector: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const buttonExists = await page.evaluate((querySelector) => {
          const button = document.querySelector(querySelector) as HTMLElement;
          console.log('Submit button Found!', button);

          if (button) {
            button.click();
            return true;
          }

          return false;
        }, selector);

        if (buttonExists) {
          resolve();
        } else {
          reject(new Error('Button not found.'));
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  public async isGitHubLoggedIn(gitHubPage: Page): Promise<boolean> {
    const settingsUrl = 'https://github.com/settings';

    try {
      await gitHubPage.bringToFront();
      await gitHubPage.goto(settingsUrl, { waitUntil: 'networkidle2' });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (gitHubPage.url() == settingsUrl) {
        const content = await gitHubPage.content();

        if (content.toLowerCase().includes(this.#gitHubProfileName)) {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  public async isLeetCodeLoggedIn(leetCodePage: Page): Promise<boolean> {
    const profileUrl = 'https://leetcode.com/profile/';

    try {
      await leetCodePage.bringToFront();
      await leetCodePage.goto(profileUrl, { waitUntil: 'networkidle2' });
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (leetCodePage.url() == profileUrl) {
        const content = await leetCodePage.content();
        if (
          content
            .toLowerCase()
            .includes(this.#leetcodeProfileName.toLowerCase())
        ) {
          return true;
        }
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  async #loginToGitHub(): Promise<void> {
    const gitHubPage = this.#getMainGitHubPage();

    await gitHubPage.bringToFront();
    await gitHubPage.goto('https://www.github.com/login', {
      waitUntil: 'networkidle2',
    });

    // Part 1: Login FORM.
    await gitHubPage.waitForSelector('input[name="login"]', {
      visible: true,
    });
    await gitHubPage.waitForSelector('input[name="password"]', {
      visible: true,
    });

    await gitHubPage.type('input[name="login"]', this.#gitHubUsername, {
      delay: 200,
    });
    await gitHubPage.type('input[name="password"]', this.#gitHubPassword, {
      delay: 200,
    });

    await this.#clickButton(gitHubPage, 'input[type="submit"]');
    await gitHubPage.waitForNavigation();

    // Part 2: 2FA (TotpCode)
    await gitHubPage.waitForSelector('#app_totp', {
      visible: true,
    });
    await gitHubPage.type('input[name="app_otp"]', this.#generateTotpCode(), {
      delay: 200,
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await gitHubPage.goto('https://www.github.com/');
  }

  async #loginToLeetCode(): Promise<void> {
    const leetCodePage = this.#getMainLeetCodePage();

    await leetCodePage.bringToFront();
    await leetCodePage.goto(
      'https://leetcode.com/accounts/github/login/?next=%2F',
      { waitUntil: 'networkidle2' },
    );
  
    await this.#clickButton(leetCodePage, 'button[type="submit"]');
    await leetCodePage.waitForNavigation({ waitUntil: 'networkidle2' });
  }

  async performLogin(): Promise<void> {
    console.log('Performing Login');

    const gitHubPage = this.#getMainGitHubPage();
    const leetCodePage = this.#getMainLeetCodePage();

    if (!(await this.isGitHubLoggedIn(gitHubPage))) {
      await this.#loginToGitHub();
    }

    if (!(await this.isLeetCodeLoggedIn(leetCodePage))) {
      await this.#loginToLeetCode();
    }

    const isGitHubLoggedIn = await this.isGitHubLoggedIn(gitHubPage);
    const isLeetCodeLoggedIn = await this.isLeetCodeLoggedIn(leetCodePage);

    if (!isGitHubLoggedIn || !isLeetCodeLoggedIn) {
      throw new Error('Login Error!');
    }
  }

  public setMainLeetCodePage(page: Page): void {
    this.#mainLeetCodePage = page;
  }

  public setMainGitHubPage(page: Page): void {
    this.#mainGitHubPage = page;
  }
}

export { LoginService };

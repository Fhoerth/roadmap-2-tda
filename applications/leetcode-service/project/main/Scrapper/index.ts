import { connect } from 'puppeteer-real-browser';
import type { Browser, Page } from 'rebrowser-puppeteer-core';

import { env } from '../env';

type PromiseStatus = 'pending' | 'resolved' | 'rejected';
type DeferredPromise<T> = {
  status: PromiseStatus;
  promise: Promise<T>;
  resolve: () => T;
  reject: (error: Error) => void;
  reset: () => void;
};

class Scrapper {
  #username = env.username;
  #password = env.password;

  #waitForConnection: DeferredPromise<void>;

  #browser?: Browser;
  #mainLeetCodePage?: Page;

  constructor() {
    this.#waitForConnection = Scrapper.createDeferredPromise();
  }

  static async createBrowser(): Promise<{ browser: Browser; page: Page }> {
    const { browser, page } = await connect({
      headless: false,
    });

    return { browser, page };
  }

  static createDeferredPromise(): DeferredPromise<void> {
    let status: PromiseStatus = 'pending';

    let resolve: () => void = () => {
      throw new Error('Promise not set.');
    };

    let reject: (error: Error) => void = () => {
      throw new Error('Promise not set.');
    };

    const setup = (): Promise<void> =>
      new Promise<void>((resolvePromise, rejectPromise) => {
        resolve = () => {
          status = 'resolved';
          resolvePromise();
        };

        reject = (error: Error) => {
          status = 'rejected';
          rejectPromise(error);
        };
      });

    const reset = (): void => {
      status = 'pending';
      setup();
    };
    const promise = setup();

    return { status, promise, resolve, reject, reset };
  }

  static createDeferredTimeoutPromise(t = 15000): DeferredPromise<void> {
    const deferredPromise = Scrapper.createDeferredPromise();

    setTimeout(() => {
      if (deferredPromise.status == 'pending') {
        deferredPromise.reject(new Error('Timeout'));
      }
    }, t);

    return deferredPromise;
  }

  #getMainLeetCodePage(): Page {
    if (!this.#mainLeetCodePage) {
      throw new Error('Page not set.');
    }

    return this.#mainLeetCodePage;
  }

  #getBrowser(): Browser {
    if (!this.#browser) {
      throw new Error('Browser not set.');
    }

    return this.#browser;
  }

  async #init(): Promise<void> {
    try {
      const deferredTimeoutPromise = Scrapper.createDeferredTimeoutPromise();
      const mainPromise = Promise.resolve()
        .then(() => this.#performLogin())
        .then(() => this.#isAliveAndConnected())
        .then(() => {
          deferredTimeoutPromise.resolve();
        });

      await Promise.all([deferredTimeoutPromise.promise, mainPromise]);
    } catch (reason: any) {
      await this.close();
      await this.launch();
    }
  }

  async #isAliveAndConnected(): Promise<void> {
    console.log('Checking if `mainLeetCodePage` is alive and connected...');

    const newPage = await this.#getBrowser().newPage();

    await Promise.all([
      newPage.goto('https://leetcode.com/profile/'),
      newPage.waitForNavigation(),
    ]);

    if (!newPage.url().includes('/profile')) {
      throw new Error('`mainLeetCodePage` is not available.');
    }

    await newPage.close();

    console.log('Browser is alive and connected :)');
  }

  async #performLogin(): Promise<void> {
    console.log('Performing LeetCode Login.');

    const page = this.#getMainLeetCodePage();

    await page.goto('https://leetcode.com/accounts/login/');
    await page.waitForSelector('input[name="login"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="login"]', this.#username, {
      delay: 200,
    });
    await page.type('input[name="password"]', this.#password, {
      delay: 200,
    });

    await page.evaluate(() => {
      const button = document.querySelector('#signin_btn') as HTMLElement;

      if (button) {
        button.click();
      } else {
        throw new Error('Signin button not found.');
      }
    });

    await page.waitForNavigation();

    console.log('Login successfully.');
  }

  async launch(): Promise<void> {
    console.log('Launching Browser');

    const { browser, page } = await Scrapper.createBrowser();

    this.#browser = browser;
    this.#mainLeetCodePage = page;
    this.#waitForConnection.reset();

    await this.#init();

    console.log('Browser launched successfully');
  }

  public async close(callback?: () => void): Promise<void> {
    await this.#getBrowser().close();
    console.log('Closed');
    callback?.();
  }
}

export { Scrapper };

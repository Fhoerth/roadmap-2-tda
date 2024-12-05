import { connect } from 'puppeteer-real-browser';
import type { Browser, Page } from 'rebrowser-puppeteer-core';
import { env } from '../env';

class Scrapper {
  #username = env.username;
  #password = env.password;
  #browser: Browser;
  #page: Page;

  #waitForConnectionPromise: Promise<void>;
  #resolveWaitForConnection: () => void;
  #rejectWaitForConnection: (error: Error) => void;

  constructor(browser: Browser, page: Page) {
    this.#browser = browser;
    this.#page = page;

    const { promise, resolve, reject } = Scrapper.createDeferredPromise();

    this.#waitForConnectionPromise = promise;
    this.#resolveWaitForConnection = resolve;
    this.#rejectWaitForConnection = reject;
  }

  static async createAndLaunchScrapper(): Promise<Scrapper> {
    const { browser, page } = await Scrapper.connect();
    const scrapper = new Scrapper(browser, page);

    await scrapper.#performLogin();

    return scrapper;
  }

  static async connect(): Promise<{ browser: Browser; page: Page }> {
    const { browser, page } = await connect({
      headless: false,
    });

    return { browser, page };
  }

  static createDeferredPromise(): {
    promise: Promise<void>;
    resolve: () => void;
    reject: (error: Error) => void;
  } {
    let resolve: () => void = () => {
      throw new Error('Promise not set.');
    };

    let reject: (error: Error) => void = () => {
      throw new Error('Promise not set.');
    };

    const promise = new Promise<void>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });

    return { promise, resolve, reject };
  }

  async #performLogin(): Promise<void> {
    try {
      await this.#page.goto('https://leetcode.com/accounts/login/');

      await this.#page.waitForSelector('input[name="login"]');
      await this.#page.waitForSelector('input[name="password"]');
      await this.#page.type('input[name="login"]', this.#username, {
        delay: 200,
      });
      await this.#page.type('input[name="password"]', this.#password, {
        delay: 200,
      });

      await this.#page.evaluate(() => {
        const button = document.querySelector('#signin_btn') as HTMLElement;
        
        if (button) {
          button.click();
        } else {
          throw new Error('Signin button not found.');
        }
      });
    
      await this.#page.waitForNavigation();

      this.#resolveWaitForConnection();
    } catch (reason) {
      this.#rejectWaitForConnection(reason as Error);
    }
  }

  async launch(): Promise<void> {
    const { browser, page } = await Scrapper.connect();

    this.#browser = browser;
    this.#page = page;

    await this.#performLogin();
  }

  public async close(callback: () => void): Promise<void> {
    await this.#browser.close();
    console.log('Closed');
    callback();
  }
}

export { Scrapper };

import { connect } from 'puppeteer-real-browser';
import type { Browser, Page } from 'rebrowser-puppeteer-core';

import { List } from '../List';
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
  #username = env.LEETCODE_USERNAME;
  #password = 'asd';

  #waitForConnection: DeferredPromise<void>;
  #lifecyclesInProgress: List<Promise<void>>;

  #browser?: Browser;
  #mainLeetCodePage?: Page;

  constructor() {
    this.#waitForConnection = Scrapper.createDeferredPromise();
    this.#lifecyclesInProgress = new List();
  }

  static async createBrowser(): Promise<{ browser: Browser; page: Page }> {
    console.log('STARTING CREATE BROWSER');

    const { browser, page } = await connect({
      headless: false,
      turnstile: true,
      disableXvfb: true,
    });

    console.log('STARTING CREATE BROWSER OK!');

    // CAMBIAR
    return { browser: browser as any, page: page as any };
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

  async #maybeClose(): Promise<void> {
    if (this.#browser) {
      this.close();
    }
  }

  async #waitForLifecycles(): Promise<void> {
    console.log('Waiting for Lifecycles');

    const tail = this.#lifecyclesInProgress.getTail();

    if (tail) {
      this.#lifecyclesInProgress.removeTail();

      await tail.value;
      await this.#waitForLifecycles();
    }

    console.log('Lifecycles OK!');
  }

  async #lifecycle(): Promise<void> {
    console.log('Lifecycle');

    const createLoginLifecycle = async (): Promise<void> => {
      // bug aca esto debereia estar abajo?
      const deferredTimeoutPromise = Scrapper.createDeferredTimeoutPromise();
      const mainPromise = Promise.resolve()
        .then(() => this.#performLogin())
        .then(() => this.#isAliveAndConnected())
        .then(() => {
          deferredTimeoutPromise.resolve();
        });

      await Promise.all([deferredTimeoutPromise.promise, mainPromise]);
    };

    const createLifecycle = async (): Promise<void> => {
      try {
        await this.#isAliveAndConnected();
      } catch (_: unknown) {
        await this.#maybeClose();
        await this.#launch();
        await createLoginLifecycle().catch(createLifecycle);
      }
    };

    await this.#waitForLifecycles();

    const node = this.#lifecyclesInProgress.append(createLifecycle());
    await node.value;

    this.#lifecyclesInProgress.removeNode(node);

    console.log('Lifecycle OK!');
  }

  async #isAliveAndConnected(): Promise<void> {
    console.log('Checking if `mainLeetCodePage` is alive and connected...');

    const newPage = await this.#getBrowser().newPage();

    await Promise.all([
      newPage.goto('https://leetcode.com/profile/'),
      newPage.waitForNavigation(),
    ]);

    const url = newPage.url();

    await newPage.close();

    if (!url.includes('/profile')) {
      throw new Error('`mainLeetCodePage` is not available.');
    }

    console.log('Browser is alive and connected :)');
  }

  async #performLogin(): Promise<void> {
    console.log('Performing LeetCode Login.');

    const page = this.#getMainLeetCodePage();
    console.log('Logging in...', this.#username, this.#password);

    await page.goto('https://leetcode.com/accounts/login/', {
      waitUntil: 'networkidle2',
    });
    await new Promise((resolve) => setTimeout(resolve, 3000));

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

  async #launch(): Promise<void> {
    console.log('Launching Browser!!!');

    const deferredTimeoutPromise = Scrapper.createDeferredTimeoutPromise(15000);

    return Promise.all([Scrapper.createBrowser(), deferredTimeoutPromise])
      .then(([{ browser, page }]) => {
        this.#browser = browser;
        this.#mainLeetCodePage = page;
        this.#waitForConnection.reset();
        deferredTimeoutPromise.resolve();

        console.log('Browser launched successfully');
      })
      .catch((error) => {
        console.log('Error launching Browser.', error);

        return this.#launch();
      });
  }

  async scrapSubmission(): Promise<string> {
    await this.#lifecycle();

    const id = '1469695308';
    const newPage = await this.#getBrowser().newPage();
    const response = await newPage.goto(
      `http://leetcode.com/submissions/detail/${id}/`,
    );
    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
    });
    if (!response) {
      throw new Error(`No response for submission id: ${id}`);
    }

    const html = await response.text();

    await newPage.close();

    return html;
  }

  async start(): Promise<void> {
    await this.#launch();
    await this.#lifecycle();
  }

  public async close(callback?: () => void): Promise<void> {
    await this.#getBrowser().close();
    console.log('Closed');
    callback?.();
  }
}

export { Scrapper };

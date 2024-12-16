import { connect } from 'puppeteer-real-browser';
import type { Browser as ReBrowser } from 'rebrowser-puppeteer-core';

import { DeferredPromise } from '../DeferredPromise';

class Browser {
  #launchingBrowser: boolean;
  #launchingBrowserForFirstTime: boolean;
  #browser: ReBrowser | null;
  #waitForBrowserToBeOpen: DeferredPromise<ReBrowser>;
  #onLaunchCallback: (() => Promise<void>) | null;
  #onDisconnectedCallback: (() => Promise<void>) | null;

  constructor() {
    this.#launchingBrowser = false;
    this.#launchingBrowserForFirstTime = true;
    this.#browser = null;
    this.#waitForBrowserToBeOpen = new DeferredPromise<ReBrowser>();
    this.#onLaunchCallback = null;
    this.#onDisconnectedCallback = null;
  }

  async #runOnLaunchCallback(): Promise<void> {
    if (this.#onLaunchCallback) {
      try {
        await this.#onLaunchCallback();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }

        return this.#runOnLaunchCallback();
      }
    }
  }

  async #launchRecursive(
    onLaunchCallback?: () => Promise<void>,
  ): Promise<void> {
    try {
      this.#onLaunchCallback = onLaunchCallback || null;

      if (!this.#launchingBrowserForFirstTime && this.#launchingBrowser) {
        await this.#waitForBrowserToBeOpen.waitForPromise();
        this.#waitForBrowserToBeOpen.reset();
      }

      if (
        !this.#launchingBrowserForFirstTime &&
        this.#browser &&
        this.#onDisconnectedCallback
      ) {
        this.#browser.off('disconnected', this.#onDisconnectedCallback);
      }

      const { browser } = await connect({
        turnstile: true,
        disableXvfb: true,
        headless: false,
        args: ['--no-sandbox'],
      });

      this.#browser = browser;

      if (this.#launchingBrowserForFirstTime) {
        this.#launchingBrowserForFirstTime = false;
      }

      await this.#runOnLaunchCallback();

      this.#waitForBrowserToBeOpen.resolve(this.getBrowser());
    } catch (_) {
      return this.#launchRecursive(onLaunchCallback);
    }
  }

  public getBrowser(): ReBrowser {
    if (!this.#browser) {
      throw new Error('Browser not set');
    }

    return this.#browser;
  }

  public waitForBrowserToBeOpen(): Promise<ReBrowser> {
    return this.#waitForBrowserToBeOpen.waitForPromise();
  }

  public launch(onLaunchCallback?: () => Promise<void>): void {
    void this.#launchRecursive(onLaunchCallback);
  }

  public async halt(): Promise<void> {
    this.#waitForBrowserToBeOpen.waitForPromise();

    if (this.#browser && this.#onDisconnectedCallback) {
      this.#browser.off('disconnected', this.#onDisconnectedCallback);
    }

    await this.close();
  }

  public async close(): Promise<void> {
    const browser = this.getBrowser();

    try {
      const pages = await browser.pages();

      for (const page of pages) {
        if (!page.isClosed()) {
          await page.close();
        }
      }
    } catch (error) {}

    await browser.disconnect();
    await browser.close();
  }
}

export { Browser };

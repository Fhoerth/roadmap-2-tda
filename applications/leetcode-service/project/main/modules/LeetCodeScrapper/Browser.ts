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
        customConfig: {
          chromePath: '/usr/bin/google-chrome',
        },
        args: [
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--no-zygote',
          // '--disable-setuid-sandbox',
          // '--disable-blink-features=AutomationControlled',
          // '--disable-accelerated-2d-canvas',
          // '--disable-gpu',
          // '--single-process',
          // '--start-maximized',
        ],
      });

      this.#browser = browser;

      if (this.#launchingBrowserForFirstTime) {
        this.#launchingBrowserForFirstTime = false;
      }

      this.#waitForBrowserToBeOpen.resolve(browser);

      await this.#runOnLaunchCallback();
    } catch (_) {
      return this.#launchRecursive(onLaunchCallback);
    }
  }

  async #close(): Promise<void> {
    const browser = await this.getBrowser();

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

  public async getBrowser(): Promise<ReBrowser> {
    await this.#waitForBrowserToBeOpen.waitForPromise();

    if (!this.#browser) {
      throw new Error('Browser not set');
    }

    return this.#browser;
  }

  public launch(onLaunchCallback?: () => Promise<void>): void {
    void this.#launchRecursive(onLaunchCallback);
  }

  public async halt(): Promise<void> {
    this.#waitForBrowserToBeOpen.waitForPromise();

    if (this.#browser && this.#onDisconnectedCallback) {
      this.#browser.off('disconnected', this.#onDisconnectedCallback);
    }

    await this.#close();
  }
}

export { Browser };

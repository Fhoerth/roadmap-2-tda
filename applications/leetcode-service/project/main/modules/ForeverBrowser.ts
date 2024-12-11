import { connect } from 'puppeteer-real-browser';
import type { Browser } from 'rebrowser-puppeteer-core';

import { DeferredPromise } from './DeferredPromise';

class ForeverBrowser {
  #halt: boolean;
  #waitForBrowserToBeOpen: DeferredPromise<Browser>;
  #launchingBrowser: boolean;
  #browser: Browser | null;
  #onRelaunchCallback: (() => void) | null;
  #onDisconnectedCallback: (() => Promise<void>) | null;

  constructor() {
    this.#halt = false;
    this.#waitForBrowserToBeOpen = new DeferredPromise<Browser>();
    this.#launchingBrowser = false;
    this.#browser = null;
    this.#onRelaunchCallback = null;
    this.#onDisconnectedCallback = null;
  }

  async #launchForeverRecursive(
    onRelaunchCallback?: () => void,
  ): Promise<void> {
    if (this.#halt) {
      throw new Error('Halt');
    }

    try {
      this.#onRelaunchCallback = onRelaunchCallback || null;

      const launch = async (): Promise<void> => {
        if (this.#launchingBrowser) {
          this.#waitForBrowserToBeOpen.waitForPromise();
          this.#waitForBrowserToBeOpen.reset();
          this.#launchingBrowser = true;
        }

        if (this.#browser && this.#onDisconnectedCallback) {
          this.#browser.off('disconnected', this.#onDisconnectedCallback);
        }

        const { browser } = await connect({
          turnstile: true,
          disableXvfb: true,
          headless: false,
          args: ['--no-sandbox'],
        });

        this.#launchingBrowser = false;
        this.#browser = browser;

        this.#onDisconnectedCallback = async () => {
          this.#waitForBrowserToBeOpen.reset();
          await launch();
          this.#onRelaunchCallback?.();
        };
        this.#browser.on('disconnected', this.#onDisconnectedCallback);

        this.#waitForBrowserToBeOpen.resolve(this.getBrowser());
      };

      await launch();
    } catch (_) {
      return this.#launchForeverRecursive(onRelaunchCallback);
    }
  }

  public getBrowser(): Browser {
    if (!this.#browser) {
      throw new Error('Browser not set');
    }

    return this.#browser;
  }

  public clearOnRelaunchCallback(): void {
    this.#onRelaunchCallback = null;
  }

  public waitForBrowserToBeOpen(): Promise<Browser> {
    return this.#waitForBrowserToBeOpen.waitForPromise();
  }

  public launchForever(onRelaunchCallback?: () => void): void {
    void this.#launchForeverRecursive(onRelaunchCallback);
  }

  public async halt(): Promise<void> {
    this.#waitForBrowserToBeOpen.waitForPromise();

    if (this.#browser && this.#onDisconnectedCallback) {
      this.getBrowser().off('disconnected', this.#onDisconnectedCallback);
    }

    this.#halt = true;
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

export { ForeverBrowser };

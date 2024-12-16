import { connect } from 'puppeteer-real-browser';
import type { Browser } from 'rebrowser-puppeteer-core';

import { DeferredPromise } from '../DeferredPromise';

class ForeverBrowser {
  #launchingBrowser: boolean;
  #launchingBrowserForFirstTime: boolean;
  #browser: Browser | null;
  #waitForBrowserToBeOpen: DeferredPromise<Browser>;
  #onLaunchCallback: (() => Promise<void>) | null;
  #onDisconnectedCallback: (() => Promise<void>) | null;

  constructor() {
    this.#launchingBrowser = false;
    this.#launchingBrowserForFirstTime = true;
    this.#browser = null;
    this.#waitForBrowserToBeOpen = new DeferredPromise<Browser>();
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

  async #launchForeverRecursive(
    onLaunchCallback?: () => Promise<void>,
  ): Promise<void> {
    try {
      this.#onLaunchCallback = onLaunchCallback || null;

      const launch = async (): Promise<void> => {
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

        this.#onDisconnectedCallback = async () => {
          this.#waitForBrowserToBeOpen.reset();
          await launch();
        };
        this.#browser.on('disconnected', this.#onDisconnectedCallback);

        this.#waitForBrowserToBeOpen.resolve(this.getBrowser());
      };

      await launch();
    } catch (_) {
      return this.#launchForeverRecursive(onLaunchCallback);
    }
  }

  public getBrowser(): Browser {
    if (!this.#browser) {
      throw new Error('Browser not set');
    }

    return this.#browser;
  }

  public clearOnLaunchCallback(): void {
    this.#onLaunchCallback = null;
  }

  public waitForBrowserToBeOpen(): Promise<Browser> {
    return this.#waitForBrowserToBeOpen.waitForPromise();
  }

  public launchForever(onLaunchCallback?: () => Promise<void>): void {
    void this.#launchForeverRecursive(onLaunchCallback);
  }

  public async relaunch(): Promise<void> {
    this.#waitForBrowserToBeOpen = new DeferredPromise<Browser>();
    try {
      await this.close();
    } catch {}
    void this.#launchForeverRecursive();
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

export { ForeverBrowser };

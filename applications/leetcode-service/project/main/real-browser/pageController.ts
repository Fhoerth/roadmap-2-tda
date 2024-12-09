import { createCursor } from 'ghost-cursor';
import type { Page as PuppeteerPage } from 'puppeteer';
import type { PuppeteerExtraPlugin } from 'puppeteer-extra-plugin';
import type { Browser, Page } from 'rebrowser-puppeteer-core';

import { checkTurnstile } from './checkTurnstile';

interface PageControllerOptions {
  browser: Browser;
  page: Page;
  turnstile: boolean;
  plugins: PuppeteerExtraPlugin[];
  killProcess: boolean;
}

export async function pageController({
  browser,
  page,
  turnstile,
  plugins,
  killProcess = false,
}: PageControllerOptions) {
  let solveStatus = turnstile;

  page.on('close', () => {
    solveStatus = false;
  });

  browser.on('disconnected', async () => {
    solveStatus = false;
    if (killProcess === true) {
      await browser.close();
    }
  });

  async function turnstileSolver() {
    while (solveStatus) {
      await checkTurnstile({ page }).catch(() => {});
      await new Promise((r) => setTimeout(r, 1000));
    }
    return;
  }

  turnstileSolver();

  if (plugins.length > 0) {
    for (const plugin of plugins) {
      plugin.onPageCreated(page as unknown as PuppeteerPage);
    }
  }

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(MouseEvent.prototype, 'screenX', {
      get: function () {
        return this.clientX + window.screenX;
      },
    });

    Object.defineProperty(MouseEvent.prototype, 'screenY', {
      get: function () {
        return this.clientY + window.screenY;
      },
    });
  });

  const cursor = createCursor(page as unknown as PuppeteerPage);

  Object.defineProperty(page, 'realCursor', { value: cursor });
  Object.defineProperty(page, 'realClick', { value: cursor.click });

  return page;
}

import type { Browser as ReBrowser } from 'rebrowser-puppeteer-core';

import { Browser } from '../main/modules/LeetCodeScrapper/Browser';

jest.setTimeout(30000);

function assertTrue(condition: boolean): void {
  if (!condition) {
    throw new Error('assert error: Condition not met.');
  }
}

describe('Browser', () => {
  it('launches browser', async () => {
    let timesBrowserHasBeenOpened = 0;
    const browser = new Browser();

    const assertPage = async (rebrowser: ReBrowser): Promise<void> => {
      const page = await rebrowser.newPage();
      await page.goto('about:blank', { waitUntil: 'domcontentloaded' });
      assertTrue(page.url() === 'about:blank');
      await page.close();
    };

    browser.launch(async () => {
      console.log(
        'Browser has been relaunched for:',
        timesBrowserHasBeenOpened + 1,
      );

      const rebrowser = await browser.getBrowser();
      await assertPage(rebrowser);

      timesBrowserHasBeenOpened += 1;
    });

    const rebrowser = await browser.getBrowser();

    try {
      await assertPage(rebrowser);
    } finally {
      await browser.halt();
    }
  });
});

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

    browser.launch(async () => {
      console.log(
        'Browser has been relaunched for:',
        timesBrowserHasBeenOpened + 1,
      );
      await browser.getBrowser().newPage();
      timesBrowserHasBeenOpened += 1;
    });

    await browser.waitForBrowserToBeOpen();
    const page = await browser.getBrowser().newPage();

    try {
      assertTrue(page.url() == 'about:blank');

      console.log('Done!');
    } catch (error) {
      throw error;
    } finally {
      await page.close();
      await browser.halt();
    }
  });
});

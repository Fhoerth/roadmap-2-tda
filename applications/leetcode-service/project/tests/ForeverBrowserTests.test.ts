import { ForeverBrowser } from '../main/modules/LeetCodeScrapper/ForeverBrowser';
import { createFailingVoidPromise } from './utils/createFailingVoidPromise';

jest.setTimeout(30000);

describe('ForeverBrowser', () => {
  it('relaunches browser when is closed', async () => {
    let timesBrowserHasBeenOpened = 0;

    const n = 5;
    const timeToLaunchBrowser = 3000;
    const browser = new ForeverBrowser();

    browser.launchForever(async () => {
      console.log(
        'Browser has been relaunched for:',
        timesBrowserHasBeenOpened + 1,
      );
      await browser.getBrowser().newPage();
      timesBrowserHasBeenOpened += 1;
    });

    await browser.waitForBrowserToBeOpen();

    for (let i = 0; i <= n; i += 1) {
      setTimeout(
        () => {
          browser.close();
        },
        (i + 1) * timeToLaunchBrowser,
      );
    }

    await new Promise((resolve) =>
      setTimeout(resolve, (n + 1) * timeToLaunchBrowser),
    );

    expect(timesBrowserHasBeenOpened).toBe(n + 1);

    browser.clearOnLaunchCallback();
    await browser.halt();

    console.log('Done!');
  });

  it('waitForBrowserToBeOpen works after calling multiple times `close()`', async () => {
    const browser = new ForeverBrowser();

    browser.launchForever();
    await browser.waitForBrowserToBeOpen();

    await Promise.all([
      browser.close(),
      browser.close(),
      browser.close(),
      browser.close(),
      browser.close(),
      browser.close(),
      browser.close(),
    ]);
    await browser.waitForBrowserToBeOpen();
    await browser.getBrowser().newPage();

    await browser.halt();
  });

  it('waitForBrowserToBeOpen works after browser has been closed', async () => {
    const browser = new ForeverBrowser();
    browser.launchForever();

    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        await browser.waitForBrowserToBeOpen();
        await browser.getBrowser().newPage();
        await browser.halt();
        resolve();
      }, 500);
    });
  });

  it('keeps launching browser until launchCallback is resolved', async () => {
    const foreverBrowser = new ForeverBrowser();

    foreverBrowser.launchForever(createFailingVoidPromise(5));

    const browser = await foreverBrowser.waitForBrowserToBeOpen();
    await browser.newPage();

    await foreverBrowser.halt();
  });
});

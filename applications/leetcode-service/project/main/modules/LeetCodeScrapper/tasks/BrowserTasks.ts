import { assert } from '../../../../common/utils/assert';
import { DeferredTimeoutPromise } from '../../DeferredTimeoutPromise';
import type { Browser } from '../Browser';

class BrowserTasks {
  readonly #browser: Browser;
  readonly #pingURL = 'https://httpbin.org/get';

  constructor(browser: Browser) {
    this.#browser = browser;
  }

  public async checkBrowserAlive(
    timeoutPromise: DeferredTimeoutPromise,
  ): Promise<void> {
    const browser = await this.#browser.getBrowser();

    const pingPage = await browser.newPage();
    const response = assert(await pingPage.goto(this.#pingURL));
    timeoutPromise.reset();

    assert(response.status());
    assert(await response.text());
    timeoutPromise.reset();

    await pingPage.close();
    timeoutPromise.reset();
  }
}

export { BrowserTasks };

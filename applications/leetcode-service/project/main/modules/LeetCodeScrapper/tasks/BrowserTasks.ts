import { assert } from '../../../../common/utils/assert';
import { DeferredTimeoutPromise } from '../../DeferredTimeoutPromise';
import { ForeverBrowser } from '../ForeverBrowser';

class BrowserTasks {
  readonly #foreverBrowser: ForeverBrowser;
  readonly #pingURL = 'https://httpbin.org/get';

  constructor(foreverBrowser: ForeverBrowser) {
    this.#foreverBrowser = foreverBrowser;
  }

  public async checkBrowserAlive(
    timeoutPromise: DeferredTimeoutPromise,
  ): Promise<void> {
    const pingPage = await this.#foreverBrowser.getBrowser().newPage();
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

import { assert } from '../../../common/utils/assert';
import { CookieService } from '../CookieService';
import { DeferredPromise } from '../DeferredPromise';
import { ForeverBrowser } from '../ForeverBrowser';
import { LoginService } from './LoginService';

class Scrapper {
  #cookieService: CookieService | null;
  #loginService: LoginService | null;
  #foreverBrowser: ForeverBrowser;

  #performingLogin: boolean;
  #waitForLogin: DeferredPromise<void>;

  constructor() {
    this.#cookieService = null;
    this.#loginService = null;
    this.#performingLogin = false;

    this.#foreverBrowser = new ForeverBrowser();
    this.#waitForLogin = new DeferredPromise<void>();

    this.#foreverBrowser.launchForever(async () => {
      this.#loginService = new LoginService();
      this.#cookieService = new CookieService();

      const browser = this.#foreverBrowser.getBrowser();

      this.#cookieService.setBrowser(browser);

      const mainGitHubPage = await browser.newPage();
      const mainLeetCodePage = await browser.newPage();

      this.#loginService.setMainGitHubPage(mainGitHubPage);
      this.#loginService.setMainLeetCodePage(mainLeetCodePage);

      await this.#performLogin();
    });
  }

  #getCookieService(): CookieService {
    return assert(this.#cookieService);
  }

  #getLoginService(): LoginService {
    return assert(this.#loginService);
  }

  async #performLogin(): Promise<void> {

  }

  public async waitForScrapperToBeReady() {}
}

export { Scrapper };

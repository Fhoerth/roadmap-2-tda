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
      this.#cookieService.loadCookies();

      const mainGitHubPage = await browser.newPage();
      const mainLeetCodePage = await browser.newPage();

      this.#loginService.setMainGitHubPage(mainGitHubPage);
      this.#loginService.setMainLeetCodePage(mainLeetCodePage);

      await this.#performLogin();

      console.log('Browser is ready to receive requests');
      console.log('GitHub login: OK!');
      console.log('LeetCode login: OK!');
    });
  }

  #getCookieService(): CookieService {
    return assert(this.#cookieService);
  }

  #getLoginService(): LoginService {
    return assert(this.#loginService);
  }

  async #performLogin(): Promise<void> {
    await this.#getLoginService().performLogin();
    this.#getCookieService().saveCookies();
    // Aca si hay un login en espera... me sumo a ese.
    // El login si falla tiene que haltear el browser y volverlo a abrir
    // Side effect se vuelve a llamar performLogin.
    console.log(this.#getCookieService, this.#getLoginService, this.#performingLogin, this.#waitForLogin);
  }

  public async waitForScrapperToBeReady(): Promise<void> {
    await this.#foreverBrowser.waitForBrowserToBeOpen();
  }

  public async halt(): Promise<void> {
    return this.#foreverBrowser.halt();
  }
}

export { Scrapper };

// import { connect } from 'puppeteer-real-browser';
// import type { Browser, Page } from 'rebrowser-puppeteer-core';
// import { CookieService } from './CookieService';
// import { LoginService } from './LoginService';
// import { Queue } from '../Queue';

// type DeferredPromise<T> = {
//   promise: Promise<T>;
//   resolve: () => T;
//   reject: (error: Error) => void;
//   reset: () => void;
// };

// type DeferredTimeoutPromise = {
//   promise: Promise<void>;
// }

// class Scrapper {
//   #waitForBrowserLaunch: DeferredPromise<void>;
//   #requests: Queue<Promise<string>>;

//   #browser?: Browser;
//   #mainLeetCodePage?: Page;
//   #mainGitHubPage?: Page;

//   constructor() {
//     this.#waitForLaunch = Scrapper.createDeferredPromise();
//     this.#lifecyclesInProgress = new List();
//   }

//   static async createBrowser(): Promise<{ browser: Browser; page: Page }> {
//     console.log('STARTING CREATE BROWSER');

//     const { browser, page } = await connect({
//       turnstile: true,
//       disableXvfb: true,
//       headless: false,
//       args: ['--no-sandbox'],
//     });

//     console.log('STARTING CREATE BROWSER OK!');

//     return { browser, page };
//   }

//   #getMainGitHubPage(): Page {
//     if (!this.#mainGitHubPage) {
//       throw new Error('Page not set.');
//     }

//     return this.#mainGitHubPage;
//   }

//   #getMainLeetCodePage(): Page {
//     if (!this.#mainLeetCodePage) {
//       throw new Error('Page not set.');
//     }

//     return this.#mainLeetCodePage;
//   }

//   #getBrowser(): Browser {
//     if (!this.#browser) {
//       throw new Error('Browser not set.');
//     }

//     return this.#browser;
//   }

//   async #maybeClose(): Promise<void> {
//     if (this.#browser) {
//       this.close();
//     }
//   }

//   static createDeferredTimeoutPromise(t = 15000): DeferredTimeoutPromise {
//     const deferredPromise = Scrapper.createDeferredPromise();

//     setTimeout(() => {
//       deferredPromise.reject(new Error('Timeout'));
//     }, t);

//     return { promise: deferredPromise.promise };
//   }

//   // Renombrar a waitForActiveRequests.
//   async #waitForActiveLifecycles(): Promise<void> {
//     const tail = this.#lifecyclesInProgress.getTail();

//     if (tail) {
//       this.#lifecyclesInProgress.removeTail();

//       await tail.value;
//       await this.#waitForActiveLifecycles();
//     }
//   }

//   // Renombrar a performRequest (con url), devuelve string
//   async #createLifecycle<T>(onResolve: (t: T) => void): Promise<void> {
//     // await this.#startLifecycle();
//     // Este crea el lifecycle y espera a todos los lifecycles
//     // Debe llamar al metodo getLeetCodePage
//   }

//   async #getLeetCodePage(): Promise<void> {
//     // Abrir una pagina, fijarse si está logueado (isLoggedIn)
//     // Si no, DEBE VER SI HAY UNA PROMISE PARA LOGEAR,
//     // EN CUYO CASO ESPERARLA Y VOLVER A LLAMARSE RECURSIVAMENTE
//     // Si no: cerrar el browser, y volver al launchForever.
//     //  --> ESte va a llamar a perform login. Una vez que termine
//     //  --> Puedo llamar recursivamente, hasta que (isLoggedIn)
//     //      devuelva True
//   }

//   async #isLoggedIn(): Promise<void> {}

//   async #performLogin(): Promise<void> {}

//   async #launchForever(): Promise<void> {
//     const deferredTimeoutPromise = Scrapper.createDeferredTimeoutPromise(15000);
//     this.#waitForConnection.revolve();

//     return Promise.race([
//       Scrapper.createBrowser(),
//       deferredTimeoutPromise,
//     ]).then((result) => {
//       if ('browser' in result && 'page' in result) {
//         const { browser, page } = result;

//         browser.on('disconnected', () => {
//           this.#launchForever();
//         });

//         return { browser, page };
//       }

//       throw new Error('Timeout!');
//     }).then(({ browser, page }) => {
//       this.#browser = browser;
//       this.#mainLeetCodePage = page;
//     })
//     .then(() => this.#getBrowser().newPage())
//     .then((page) => {
//       this.#mainGitHubPage = page;
//       this.#waitForConnection.clear();

//       console.log('Browser launched successfully');
//     })
//     .then(() => {
//       this.#startLifecycle();
//     })
//     .catch((error) => {
//       console.log('Error launching Browser.', error);

//       return this.#launchForever();
//     });
//   }

//   async scrapSubmission(): Promise<string> {
//     // Crear lifecycle
//     const id = '1469695308';
//     const newPage = await this.#getBrowser().newPage();
//     const response = await newPage.goto(
//       `http://leetcode.com/submissions/detail/${id}/`,
//     );
//     await new Promise<void>((resolve) => {
//       setTimeout(() => resolve(), 3000);
//     });
//     if (!response) {
//       throw new Error(`No response for submission id: ${id}`);
//     }

//     const html = await response.text();

//     await newPage.close();

//     return html;
//   }

//   async start(): Promise<void> {
//     await this.#launchForever();
//   }

//   public async close(callback?: () => void): Promise<void> {
//     await this.#getBrowser().close();
//     console.log('Closed');
//     callback?.();
//   }
// }

// export { Scrapper };

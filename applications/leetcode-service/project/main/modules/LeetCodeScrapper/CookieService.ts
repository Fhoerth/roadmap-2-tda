import fs from 'fs/promises';
import { mkdirp } from 'mkdirp';
import path from 'path';
import type { Cookie } from 'rebrowser-puppeteer-core';

import { env } from '../../env';
import type { Browser } from './Browser';

class CookieService {
  #cookieDir = env.LEETCODE_SERVICE_COOKIE_DIR;
  #cookieFile = path.join(this.#cookieDir, 'cookies.json');
  #browser: Browser;

  constructor(browser: Browser) {
    this.#browser = browser;
  }

  async saveCookies(): Promise<void> {
    const browser = await this.#browser.getBrowser();
    const context = browser.defaultBrowserContext();

    try {
      const cookies = await context.cookies();
      const stringifiedCookies = JSON.stringify(cookies, null, 2);
      const parsedCookies: Record<string, Record<string, unknown>> = JSON.parse(
        stringifiedCookies,
      );

      // Remove partition keys since it has trouble while loading
      // cookies into browser.
      for (const [key] of Object.entries(parsedCookies)) {
        if ('partitionKey' in parsedCookies[key]) {
          delete parsedCookies[key].partitionKey;
        }
      }

      await mkdirp(this.#cookieDir);
      await fs.writeFile(
        this.#cookieFile,
        JSON.stringify(parsedCookies, null, 2),
        'utf-8',
      );
    } catch (error) {
      console.error('Failed to save cookies:', error);
    }
  }

  async loadCookies(): Promise<void> {
    const browser = await this.#browser.getBrowser();

    try {
      const cookiesExist = await fs.stat(this.#cookieFile).catch(() => false);

      if (!cookiesExist) {
        return;
      }

      const cookies: Cookie[] = JSON.parse(
        await fs.readFile(this.#cookieFile, 'utf-8'),
      );

      await browser.setCookie(...cookies);
      console.log('Cookies loaded successfully.');
    } catch (error) {
      console.error('Error while loading cookies:', error);
    }
  }
}

export { CookieService };

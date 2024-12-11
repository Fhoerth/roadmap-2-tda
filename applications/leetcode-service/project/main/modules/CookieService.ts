import fs from 'fs/promises';
import { mkdirp } from 'mkdirp';
import path from 'path';
import type { Browser, Cookie } from 'rebrowser-puppeteer-core';

import { assert } from '../../common/utils/assert';
import { env } from '../env';

class CookieService {
  #cookieDir = env.LEETCODE_SERVICE_COOKIE_DIR;
  #cookieFile = path.join(this.#cookieDir, 'cookies.json');
  #browser: Browser | null = null;

  #getBrowser(): Browser {
    return assert(this.#browser);
  }

  public setBrowser(browser: Browser) {
    this.#browser = browser;
  }

  async saveCookies(): Promise<void> {
    const browser = this.#getBrowser();
    const context = browser.defaultBrowserContext();

    try {
      const cookies = await context.cookies();

      await mkdirp(this.#cookieDir);
      await fs.writeFile(
        this.#cookieFile,
        JSON.stringify(cookies, null, 2),
        'utf-8',
      );
    } catch (error) {
      console.error('Failed to save cookies:', error);
    }
  }

  async loadCookies(): Promise<void> {
    const browser = this.#getBrowser();

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

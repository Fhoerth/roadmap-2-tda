import fs from 'fs/promises';
import { mkdirp } from 'mkdirp';
import path from 'path';
import type { Browser, BrowserContext, Cookie } from 'puppeteer-core';

import { env } from './env';

const COOKIE_DIR = env.LEETCODE_SERVICE_COOKIE_DIR;
const COOKIE_FILE = path.join(COOKIE_DIR, 'cookies.json');

async function saveCookies(context: BrowserContext): Promise<void> {
  try {
    const cookies = await context.cookies();
    await mkdirp(COOKIE_DIR);
    await fs.writeFile(COOKIE_FILE, JSON.stringify(cookies, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to save cookies:', error);
  }
}

async function loadCookies(browser: Browser): Promise<void> {
  try {
    const cookiesExist = await fs.stat(COOKIE_FILE).catch(() => false);

    if (!cookiesExist) {
      return;
    }

    const cookies: Cookie[] = JSON.parse(
      await fs.readFile(COOKIE_FILE, 'utf-8'),
    );

    await browser.setCookie(...cookies);
    console.log('Cookies cargadas correctamente.');
  } catch (error) {
    console.error('Error al cargar las cookies:', error);
  }
}

export { saveCookies };
export { loadCookies };

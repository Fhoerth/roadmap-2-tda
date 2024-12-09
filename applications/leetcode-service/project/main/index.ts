import process from 'process';
import puppeteer from 'puppeteer-core';
import type { BrowserContext, Browser, Page } from 'puppeteer-core';

// import { pageController } from './real-browser/pageController';
// import { waitForPageUrl } from './waitForPageUrl';
import { getTotpCode } from './authenticator';
// import { saveCookies, loadCookies } from './cookieManager';
import { loadCookies } from './cookieManager';
import { saveCookies } from './cookieManager';
import { env } from './env';
import { saveHtmlToFile } from './mocks';
import { server } from './server';

const OK = 0;

async function createPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  );
  await page.setJavaScriptEnabled(true);
  return page;
}

async function clickButton(page: Page, selector: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const buttonExists = await page.evaluate((querySelector) => {
        const button = document.querySelector(querySelector) as HTMLElement;
        console.log('Submit button Found!', button);

        if (button) {
          button.click();
          return true; // Indica que el botón fue encontrado y clicado
        }

        return false; // Indica que el botón no fue encontrado
      }, selector);

      if (buttonExists) {
        resolve();
      } else {
        reject(new Error('Button not found.'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function isGithubLoggedIn(githubLoginPage: Page): Promise<boolean> {
  const settingsUrl = 'https://github.com/settings';

  try {
    await githubLoginPage.goto(settingsUrl, {waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (githubLoginPage.url() == settingsUrl) {
      await saveHtmlToFile(githubLoginPage);
      const content = await githubLoginPage.content();

      if (content.includes(env.GITHUB_PROFILE_NAME)) {
        return true;
      }
    }

    return false;
  } catch(error) {
    return false;
  }
}

async function isLeetCodeLoggedIn(leetCodePage: Page): Promise<boolean> {
  const profileUrl = 'https://leetcode.com/';

  try {
    await leetCodePage.goto(profileUrl, { waitUntil: 'networkidle2' });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (leetCodePage.url() == profileUrl) {
      await saveHtmlToFile(leetCodePage);
      const content = await leetCodePage.content();
      
      console.log('\n\n\n\n\n\n', env.LEETCODE_USERNAME, content.includes(env.LEETCODE_USERNAME));

      if (content.includes(env.LEETCODE_USERNAME.toLowerCase())) {
        return true;
      }
    }

    return false;
  } catch(error) {
    return false;
  }
}

async function loginToGithub(context: BrowserContext, githubLoginPage: Page): Promise<void> {
  await githubLoginPage.goto('https://www.github.com/login', {
    waitUntil: 'networkidle2',
  });
  saveHtmlToFile(githubLoginPage);

  await githubLoginPage.waitForSelector('input[name="login"]', {
    visible: true,
  });
  await githubLoginPage.waitForSelector('input[name="password"]', {
    visible: true,
  });

  console.log('Filling inputs...');
  await githubLoginPage.type('input[name="login"]', env.GITHUB_USERNAME, {
    delay: 200,
  });
  await githubLoginPage.type('input[name="password"]', env.GITHUB_PASSWORD, {
    delay: 200,
  });

  console.log('Clicking submit.');

  await githubLoginPage.evaluate(() => {
    const button = document.querySelector(
      'input[type="submit"]',
    ) as HTMLElement;

    if (button) {
      button.click();
    } else {
      throw new Error('Signin button not found.');
    }
  });

  console.log('Waiting for navigation.');
  await githubLoginPage.waitForNavigation();
  console.log('Done!');

  await saveHtmlToFile(githubLoginPage);

  // 2Factor Auth.
  await githubLoginPage.waitForSelector('#app_totp', {
    visible: true,
  });
  await githubLoginPage.type('input[name="app_otp"]', getTotpCode(), {
    delay: 200,
  });

  console.log('Waiting for navigation.');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log('Done!');
  await saveCookies(context);
  await saveHtmlToFile(githubLoginPage);
}

async function loginToLeetCode(context: BrowserContext, leetCodePage: Page): Promise<void> {
  await leetCodePage.goto('https://leetcode.com/accounts/github/login/?next=%2F', { waitUntil: 'networkidle2' });
  await clickButton(leetCodePage, 'button[type="submit"]');
  await leetCodePage.waitForNavigation({ waitUntil: 'networkidle2' });
  await saveCookies(context);
}

async function main() {
  console.log('Registering SIGINT listener.');

  process.on('SIGINT', () => {
    console.log('Browser has been closed.');

    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(OK);
    });
  });

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
    ],
  });
  await loadCookies(browser);

  const context = browser.defaultBrowserContext();
  const githubLoginPage = await createPage(browser);

  if (!(await isGithubLoggedIn(githubLoginPage))) {
    await loginToGithub(context, githubLoginPage);
  }

  await githubLoginPage.goto('https://github.com/settings');

  const leetCodePage = await createPage(browser);

  if (!(await isLeetCodeLoggedIn(leetCodePage))) {
    await loginToLeetCode(context, leetCodePage);
  }

  console.log('Sleeping 5s...');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  
  console.log('Fetching submission...');
  const submissionPage = await createPage(browser);
  const id = '1469695308';
  const response = await submissionPage.goto(
    `http://leetcode.com/submissions/detail/${id}/`,
    { waitUntil: 'networkidle2'},
  );

  if (!response) {
    throw new Error(`No response for submission id: ${id}`);
  }

  saveHtmlToFile(submissionPage);

  console.log('Flow Finished!');
}

void main();

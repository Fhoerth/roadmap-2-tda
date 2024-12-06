import dotenv from 'dotenv';
import path from 'path';
import puppeteer, { Browser, Page } from 'puppeteer';

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)

dotenv.config();

const htmlPath = path.join(__dirname, 'output.html');
console.log(htmlPath);

const username = process.env.UNAME!;
const password = process.env.PWORD!;
const lcUsername = process.env.LCUNAME!;

async function createPage(browser: Browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
  );
  return page;
}

async function clickButton(page: Page, selector: string) {
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

async function checkIfUserIsLoggedIn(browser: Browser) {
  console.log('Checking if user is logged in....');
  const page = await createPage(browser);

  try {
    const response = await page.goto('https://leetcode.com/profile', {
      waitUntil: 'networkidle2',
    });

    if (response) {
      const text = await response.text();
      console.log('Looking for username', lcUsername);
      if (!text.includes(lcUsername)) {
        throw new Error('Loggin Not Success.');
      }
    } else {
      throw new Error('No response from /profile!');
    }
  } catch (error) {
    await page.close();
    throw error;
  }
}

async function ensureLeetCodeLogin(browser: Browser) {
  const page = await createPage(browser);

  try {
    const response = await page.goto(
      'https://leetcode.com/accounts/github/login/?next=%2Fu%2Flogin%2F',
      { waitUntil: 'networkidle2' },
    );

    if (response) {
      await response.text();
    }

    console.log('Looking for Loggin Button...');
    await clickButton(page, 'button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    return checkIfUserIsLoggedIn(browser);
  } catch {
    console.log('Ensure Leet Code Login Failed, proably treated as a bot');
    await page.close();
    return ensureLeetCodeLogin(browser);
  }
}

async function fetchSumission(browser: Browser, submissionId: string) {
  console.log('Fetching Submission...');

  const page = await createPage(browser);
  const response = await page.goto(
    `https://leetcode.com/submissions/detail/${submissionId}/`,
    { waitUntil: 'networkidle2' },
  );

  if (response) {
    const text = await response.text();
    console.log(text);
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const githubLoginPage = await createPage(browser);
  await githubLoginPage.goto('https://www.github.com/login');

  await githubLoginPage.waitForSelector('input[name="login"]', {
    visible: true,
  });
  await githubLoginPage.waitForSelector('input[name="password"]', {
    visible: true,
  });

  console.log('Filling inputs...');
  await githubLoginPage.type('input[name="login"]', username, { delay: 200 });
  await githubLoginPage.type('input[name="password"]', password, {
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

  console.log('Initializing LeetCode Login Process...');
  await ensureLeetCodeLogin(browser);

  await fetchSumission(browser, '1469695308');
  console.log('Finished!');
}

void main();

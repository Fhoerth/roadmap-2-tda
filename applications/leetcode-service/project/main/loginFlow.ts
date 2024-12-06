import dotenv from 'dotenv';
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

dotenv.config();

const htmlPath = path.join(__dirname, 'output.html');
console.log(htmlPath);

const username = process.env.UNAME!;
const password = process.env.PWORD!;
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36';

puppeteer.launch({ headless: true, executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(async browser => {
  const page = await browser.newPage()
  await page.setViewport({ width: 800, height: 600 })
  await page.setUserAgent(userAgent);

  console.log('Going to github.com');
  await page.goto('https://www.github.com/login', { waitUntil: 'networkidle2' });

  await page.waitForSelector('input[name="login"]', { visible: true });
  await page.waitForSelector('input[name="password"]', { visible: true });

  console.log('Filling inputs...');
  await page.type('input[name="login"]', username, { delay: 200 });
  await page.type('input[name="password"]', password, { delay: 200 });

  console.log('Clicking submit.');
  await page.evaluate(() => {
    const button = document.querySelector('input[type="submit"]') as HTMLElement;

    if (button) {
      button.click();
    } else {
      throw new Error('Signin button not found.');
    }
  });

  console.log('Waiting for navigation.');
  await page.waitForNavigation();

  const newPage = await browser.newPage();
  await newPage.setViewport({ width: 800, height: 600 })
  await newPage.setUserAgent(userAgent);

  console.log('Navigating to leetcode login.');
  const loginResponse = await newPage.goto('https://leetcode.com/accounts/github/login/?next=%2Fu%2Flogin%2F', { waitUntil: 'networkidle2' });

  if (loginResponse) {
    const text = await loginResponse.text();
    console.log(text);
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));

  await newPage.evaluate(() => {
    const button = document.querySelector('button[type="submit"]') as HTMLElement;

    if (button) {
      button.click();
    } else {
      throw new Error('Continue button not found.');
    }
  });

  console.log('Fetching submission.');
  const thirdPage = await browser.newPage();
  await thirdPage.setViewport({ width: 800, height: 600 })
  await thirdPage.setUserAgent(userAgent);
  await thirdPage.waitForNetworkIdle({ idleTime: 2000 });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const response = await thirdPage.goto('https://leetcode.com/submissions/detail/1469695308/', {waitUntil: 'networkidle2'});
  
  if (response) {
    const text = await response.text();
    fs.writeFileSync(htmlPath, text);
    console.log(text);
  }
});
// // import process from 'process';
// // import { Scrapper } from './Scrapper';
// // import { server } from './server';
// // const OK = 0;
// // async function main() {
// //   const scrapper = new Scrapper();
// //   console.log('Registering SIGINT listener.');
// //   process.on('SIGINT', () => {
// //     scrapper.close(() => {
// //       console.log('Browser has been closed.');
// //       server.close(() => {
// //         console.log('HTTP server closed.');
// //         process.exit(OK);
// //       });
// //     });
// //   });
// //   await scrapper.start();
// //   const submission = await scrapper.scrapSubmission();
// //   console.log('SUBMISSION', submission);
// // }
// // void main();
import process from 'process';
import puppeteer from 'puppeteer-core';

// import { saveCookies, loadCookies } from './cookieManager';
import { loadCookies } from './cookieManager';
import { server } from './server';

// import { pageController } from './real-browser/pageController';

// import { waitForPageUrl } from './waitForPageUrl';

const OK = 0;

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
    headless: false,
    defaultViewport: null,
    executablePath: '/usr/bin/google-chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
  });
  await loadCookies(browser);

  // const context = browser.defaultBrowserContext();
  const page = await browser.newPage();
  await page.goto('https://leetcode.com/accounts/login/', {
    waitUntil: 'networkidle2',
  });

  // await waitForPageUrl(page, 'https://leetcode.com/u/aprotoleetcode/');

  // console.log('ALREADY LOGGED IN SAVING COOKIES!');

  // await saveCookies(context);

  console.log(await page.title());
}

void main();

// import process from 'process';
// import { Scrapper } from './Scrapper';
// import { server } from './server';
// const OK = 0;
// async function main() {
//   const scrapper = new Scrapper();
//   console.log('Registering SIGINT listener.');
//   process.on('SIGINT', () => {
//     scrapper.close(() => {
//       console.log('Browser has been closed.');
//       server.close(() => {
//         console.log('HTTP server closed.');
//         process.exit(OK);
//       });
//     });
//   });
//   await scrapper.start();
//   const submission = await scrapper.scrapSubmission();
//   console.log('SUBMISSION', submission);
// }
// void main();
// import process from 'process';

// import { server } from './server';
// import { Scrapper } from './Scrapper';
// // import { connect } from 'puppeteer-real-browser';

// const OK = 0;

// async function main() {
//   const scrapper = new Scrapper();

//   console.log('Registering SIGINT listener.');

//   process.on('SIGINT', () => {
//     scrapper.close(() => {
//       console.log('Browser has been closed.');

//       server.close(() => {
//         console.log('HTTP server closed.');
//         process.exit(OK);
//       });
//     });
//   });

//   await scrapper.start();
//   const submission = await scrapper.scrapSubmission();

//   console.log('SUBMISSION', submission);
// }

// void main();

const path = require('path');
const fs = require('fs');
const { connect } = require('puppeteer-real-browser');

(async () => {
  const useDataDir = path.resolve(__dirname, 'output');

  if (!fs.existsSync(useDataDir)) {
    fs.mkdirSync(useDataDir, { recursive: true });
  }

  const username = 'zFGiveN2';
  const password = 'c4mpu5210';

  const { browser, page } = await connect({
    headless: false,
    useDataDir,
    disableXvfb: true,
  });

  browser.on('disconnected', () => {
    console.log('CLOSED!');
  });

  await page.goto('https://leetcode.com/accounts/login/');

  await page.waitForSelector('input[name="login"]');
  await page.waitForSelector('input[name="password"]');

  await page.type('input[name="login"]', username, { delay: 200 }); // Escribe el usuario
  await page.type('input[name="password"]', password, { delay: 200 }); // Escribe la contraseña

  await page.evaluate(() => {
    const button = document.querySelector('#signin_btn');
    if (button) {
      button.click();
    } else {
      console.error('Botón no encontrado');
    }
  });

  await page.waitForNavigation();
  console.log('DONE!');
  await page.goto('https://leetcode.com/submissions/detail/597974907/');

  browser.close();
  setTimeout(() => {
    console.log('bYe!');
  }, 5000);
})();
// const { executablePath } = require('puppeteer');
// const puppeteer = require('puppeteer-extra');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// puppeteer.use(StealthPlugin());

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//     executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
//   });
//   const page = await browser.newPage();

//   await page.goto('https://leetcode.com/accounts/login/');

//   await page.waitForSelector('input[name="cf_turnstile_token"]');
//   const turnstileToken = await page.$eval(
//     'input[name="cf_turnstile_token"]',
//     (el) => el.value
//   );

//   console.log(`Turnstile Token: ${turnstileToken}`);
//   await browser.close();
// })();
// // const axios= require('axios');
// // const antibotbrowser = require('antibotbrowser');

// // const API_URL = process.env.LEETCODE_API_URL || 'https://leetcode.com/graphql';

// // const getUserProfileQuery = `#graphql
// // query getUserProfile($username: String!) {
// //     allQuestionsCount {
// //         difficulty
// //         count
// //     }
// //     matchedUser(username: $username) {
// //         username
// //         githubUrl
// //         twitterUrl
// //         linkedinUrl
// //         contributions {
// //             points
// //             questionCount
// //             testcaseCount
// //         }
// //         profile {
// //             realName
// //             userAvatar
// //             birthday
// //             ranking
// //             reputation
// //             websites
// //             countryName
// //             company
// //             school
// //             skillTags
// //             aboutMe
// //             starRating
// //         }
// //         badges {
// //             id
// //             displayName
// //             icon
// //             creationDate
// //         }
// //         upcomingBadges {
// //             name
// //             icon
// //         }
// //         activeBadge {
// //             id
// //             displayName
// //             icon
// //             creationDate
// //         }
// //         submitStats {
// //             totalSubmissionNum {
// //                 difficulty
// //                 count
// //                 submissions
// //             }
// //             acSubmissionNum {
// //                 difficulty
// //                 count
// //                 submissions
// //             }
// //         }
// //         submissionCalendar
// //     }
// //     recentSubmissionList(username: $username, limit: 20) {
// //         title
// //         titleSlug
// //         timestamp
// //         statusDisplay
// //         lang
// //     }
// // }`;

// // async function queryLeetCodeAPI(query, variables) {
// //   try {
// //     const response = await axios.post(API_URL, { query, variables });
// //     if (response.data.errors) {
// //       throw new Error(response.data.errors[0].message);
// //     }
// //     return response.data;
// //   } catch (error) {
// //     if (error.response) {
// //       throw new Error(`Error from LeetCode API: ${error.response.data}`);
// //     } else if (error.request) {
// //       throw new Error('No response received from LeetCode API');
// //     } else {
// //       throw new Error(`Error in setting up the request: ${error.message}`);
// //     }
// //   }
// // }

// // async function main() {
// //   const data = await queryLeetCodeAPI(getUserProfileQuery, {
// //     username: 'zFGiveN2',
// //   });
// //   console.log('OK', data);
// // }

// // void main();

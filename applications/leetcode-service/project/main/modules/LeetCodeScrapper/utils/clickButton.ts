import type { Page } from 'rebrowser-puppeteer-core';

function clickButton(page: Page, selector: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const buttonExists = await page.evaluate((querySelector) => {
        const button = document.querySelector(querySelector) as HTMLElement;
        console.log('Submit button Found!', button);

        if (button) {
          button.click();
          return true;
        }

        return false;
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

export { clickButton };

import type { Page } from 'puppeteer';

async function waitForPageUrl(page: Page, targetUrl: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    page.on('framenavigated', checkUrl);

    const timeout = setTimeout(() => {
      page.off('framenavigated', checkUrl);
      reject(
        new Error(`Timeout: Page did not navigate to the URL: ${targetUrl}`),
      );
    }, 60000);

    function checkUrl(): void {
      console.log(`Navigated to url: ${page.url()}`);

      if (page.url() === targetUrl) {
        clearTimeout(timeout);
        page.off('framenavigated', checkUrl);
        resolve();
      }
    }

    // Check the URL immediately in case it already matches
    checkUrl();
  });
}

export { waitForPageUrl };

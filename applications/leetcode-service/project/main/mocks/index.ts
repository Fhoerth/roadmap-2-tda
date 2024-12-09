import fs from 'fs/promises';
import path from 'path';
import type { Page } from 'puppeteer-core';

import { env } from '../env';

/**
 * Saves HTML content to a file.
 * @param html The HTML content to save.
 * @param filename The name of the file (without extension).
 */
async function saveHtmlToFile(page: Page) {
  const filename = page.url();
  const safeFileName = filename
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');

  const outputDir = path.join(env.LEETCODE_SERVICE_MOCK_DIR);
  const filePath = path.join(outputDir, `${safeFileName}.html`);
  const html = await page.content();

  try {
    // Ensure the directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write the HTML to the file
    await fs.writeFile(filePath, html, 'utf-8');
    console.log(`HTML saved to: ${filePath}`);
  } catch (error) {
    console.error(`Failed to save HTML: ${error}`);
  }
}

export { saveHtmlToFile };

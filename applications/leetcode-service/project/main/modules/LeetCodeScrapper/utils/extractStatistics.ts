import path from 'path';
import type { Page } from 'rebrowser-puppeteer-core';

import { assert } from '../../../../common/utils/assert';
import { env } from '../../../env';
import {
  Base64EncodedString,
  StatisticsResult,
} from '../types/StatisticsResult';
import { SubmissionId } from '../types/SubmissionId';
import { captureElementScreenshot } from './captureScreenshot';
import { convertImageToBase64 } from './convertImageToBase64';
import { searchByText } from './searchByText';

async function extractStatistics(
  submissionId: SubmissionId,
  statisticsPage: Page,
): Promise<StatisticsResult> {
  const promises = new Array(10)
    .fill(0)
    .map((_, i) =>
      searchByText(
        statisticsPage,
        `[data-layout-path="/ts0/t${i}"]`,
        'Accepted',
      ).catch(() => false),
    );
  const results = await Promise.all(promises);
  const solved = results.some((value) => value);

  if (!solved) {
    return {
      submissionId,
      solved,
      image: null,
    };
  }

  const screenshotOutputPath = path.join(
    env.LEETCODE_SERVICE_SCREENSHOTS_DIR,
    `statistics-${submissionId}.png`,
  );
  const elementHandle = assert(await statisticsPage.$('body'));
  await captureElementScreenshot(elementHandle, screenshotOutputPath);
  const base64EncodedString: Base64EncodedString =
    await convertImageToBase64(screenshotOutputPath);

  return {
    submissionId,
    solved,
    image: base64EncodedString,
  };
}

export { extractStatistics };

import path from 'path';
import type { Page } from 'rebrowser-puppeteer-core';

import { assert } from '../../../../common/utils/assert';
import { env } from '../../../env';
import {
  Base64EncodedString,
  StatisticsResult,
} from '../types/StatisticsResult';
import { SubmissionId } from '../types/SubmissionId';
import { captureSubmissionScreenshot } from './captureSubmissionScreenshot';
import { convertImageToBase64 } from './convertImageToBase64';
import { isAccepted } from './isAccepted';

async function extractStatistics(
  submissionId: SubmissionId,
  statisticsPage: Page,
): Promise<StatisticsResult> {
  const accepted = await isAccepted(statisticsPage);

  if (!accepted) {
    return {
      submissionId,
      accepted,
      image: null,
    };
  }

  const screenshotOutputPath = path.join(
    env.LEETCODE_SERVICE_SCREENSHOTS_DIR,
    `statistics-${submissionId}.png`,
  );
  const elementHandle = assert(await statisticsPage.$('body'));
  await captureSubmissionScreenshot(elementHandle, screenshotOutputPath);
  const base64EncodedString: Base64EncodedString =
    await convertImageToBase64(screenshotOutputPath);

  return {
    submissionId,
    accepted,
    image: base64EncodedString,
  };
}

export { extractStatistics };

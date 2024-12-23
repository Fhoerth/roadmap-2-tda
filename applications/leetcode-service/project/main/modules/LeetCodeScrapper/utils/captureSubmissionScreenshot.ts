import { spawn } from 'child_process';
import { rename, rm } from 'fs/promises';
import type { ElementHandle } from 'rebrowser-puppeteer-core';

import { sanitizePath } from './sanitizePath';

async function cropImage(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let sanitizedPath: string = path;

    try {
      sanitizedPath = sanitizePath(path);
    } catch {
      reject(new Error('Invalid path.'));
      return;
    }

    const tmpPath = sanitizedPath.replace('.png', '-cropped.png');
    const args = ['-i', path, '-vf', 'crop=611:458:15:122', tmpPath];
    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        return Promise.resolve()
          .then(() => rm(sanitizedPath))
          .then(() => rename(tmpPath, sanitizedPath))
          .then(resolve)
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(new Error('ffmpeg exited with code != 0'));
      }
    });
  });
}

async function captureSubmissionScreenshot(
  elementHandle: ElementHandle<Node>,
  outputPath: string,
) {
  await elementHandle.screenshot({ path: outputPath });
  await cropImage(outputPath);

  console.log(`Screenshot has been saved: ${outputPath}`);
}

export { captureSubmissionScreenshot };

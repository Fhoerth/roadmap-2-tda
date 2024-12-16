import { exec } from 'child_process';
import { rename, rm } from 'fs/promises';
import type { ElementHandle } from 'rebrowser-puppeteer-core';

async function cropImage(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tmpPath = path.replace('.png', '-cropped.png');
    const command = `ffmpeg -i ${path} -vf "crop=611:458:15:122" ${tmpPath}`;

    exec(command, async (error) => {
      if (error) {
        reject(error);
      } else {
        try {
          await rm(path);
          await rename(tmpPath, path);
          resolve();
        } catch (fsError) {
          reject(fsError);
        }
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

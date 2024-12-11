const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { mkdirpSync } = require('mkdirp');

async function captureScreenshots(outputDir, duration, fps) {
  const interval = 1000 / fps; // Intervalo entre capturas en ms
  const totalFrames = duration * fps;
  let frameCount = 0;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting screenshot capture...');
  while (frameCount < totalFrames) {
    const filename = path.join(
      outputDir,
      `frame-${String(frameCount).padStart(4, '0')}.png`,
    );
    await screenshot({ filename });
    frameCount++;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  console.log('Screenshots captured.');
}

function combineScreenshotsToVideo(outputDir, outputFile, fps) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -framerate ${fps} -i ${outputDir}/frame-%04d.png -c:v libx264 -pix_fmt yuv420p ${outputFile}`;
    exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        console.log('Video created:', outputFile);
        resolve();
      }
    });
  });
}

async function main() {
  const outputDir = path.join(__dirname, 'frames');
  mkdirpSync(outputDir);
  const outputFile = path.join(__dirname, 'output.mp4');

  const duration = 5; // Duración en segundos
  const fps = 18; // Frames por segundo

  try {
    await captureScreenshots(outputDir, duration, fps);
    // await combineScreenshotsToVideo(outputDir, outputFile, fps);
    console.log('Screen recording completed.');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Limpiar capturas si no necesitas guardarlas
    // fs.rmSync(outputDir, { recursive: true, force: true });
  }
}

main();

import process from 'process';

import { Scrapper } from './modules/Scrapper/Scrapper';
import { server } from './server';

const OK = 0;

async function main() {
  const scrapper = new Scrapper();

  console.log('Registering SIGINT listener.');

  process.on('SIGINT', async () => {
    await Promise.all([
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
      scrapper.halt(),
    ]);
    process.exit(OK);
  });

  await scrapper.waitForScrapperToBeReady();

  console.log('SCRAPPER', scrapper);
}

void main();

import process from 'process';

import { Scrapper } from './modules/Scrapper';
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

  const submission = await scrapper.fetchSubmission('1462218586');

  console.log('SCRAPPER', submission);
}

void main();

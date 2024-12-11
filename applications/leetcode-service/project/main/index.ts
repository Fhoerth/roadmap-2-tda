import process from 'process';

import { scrapper } from './modules/Scrapper';
import { server } from './server';

const OK = 0;

async function main() {
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
}

void main();

import process from 'process';

import { leetCodeScrapper } from './modules/LeetCodeScrapper';
import { server } from './server';

const OK = 0;

async function main() {
  console.log('Registering SIGINT listener.');

  process.on('SIGINT', async () => {
    await Promise.all([
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
      leetCodeScrapper.halt(),
    ]);
    process.exit(OK);
  });
}

void main();

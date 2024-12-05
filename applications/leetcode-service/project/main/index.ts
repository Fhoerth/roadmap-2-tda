import process from 'process';

import { Scrapper } from './Scrapper';
import { server } from './server';

const OK = 0;

async function main() {
  const scrapper = new Scrapper();

  console.log('Registering SIGINT listener.');

  process.on('SIGINT', () => {
    scrapper.close(() => {
      console.log('Browser has been closed.');

      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(OK);
      });
    });
  });

  await scrapper.start();
}

void main();

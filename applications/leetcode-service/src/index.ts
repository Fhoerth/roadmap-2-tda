import process from 'process';

import { server } from './server';
import { Scrapper } from './Scrapper';

const OK = 0;

async function main() {
  const scrapper = await Scrapper.createAndLaunchScrapper();

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
}

void main();


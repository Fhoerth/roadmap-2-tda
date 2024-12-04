import process from 'process';
import { server } from './server';

const OK = 0;

process.on('SIGINT', () => {
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(OK);
  });
})
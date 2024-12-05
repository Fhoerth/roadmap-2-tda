import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const env = {
  username: process.env.USERNAME || 'OVERRIDE_DEFAULT_USERNAME',
  password: process.env.PASSWORD || 'OVERRIDE_DEFAULT_PASSWORD',
};

export { env };

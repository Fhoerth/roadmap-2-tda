import dotenv from 'dotenv';
import process from 'process';

import { assert } from '../common/utils/assert';

dotenv.config();

const PORT = assert(process.env.PORT);
const LEETCODE_SERVICE_COOKIE_DIR = assert(
  process.env.LEETCODE_SERVICE_COOKIE_DIR,
);
const LEETCODE_SERVICE_SCREENSHOTS_DIR = assert(
  process.env.LEETCODE_SERVICE_SCREENSHOTS_DIR,
);
const LEETCODE_SERVICE_MOCK_DIR = assert(process.env.LEETCODE_SERVICE_MOCK_DIR);
const LEETCODE_PROFILE_NAME = assert(process.env.LEETCODE_PROFILE_NAME);
const GITHUB_USERNAME = assert(process.env.GITHUB_USERNAME);
const GITHUB_PASSWORD = assert(process.env.GITHUB_PASSWORD);
const GITHUB_TOPT_SECRET = assert(process.env.GITHUB_TOPT_SECRET);
const GITHUB_PROFILE_NAME = assert(process.env.GITHUB_PROFILE_NAME);
const DISPLAY = assert(process.env.DISPLAY);

const env = {
  PORT,
  LEETCODE_SERVICE_COOKIE_DIR,
  LEETCODE_SERVICE_SCREENSHOTS_DIR,
  LEETCODE_SERVICE_MOCK_DIR,
  LEETCODE_PROFILE_NAME,
  GITHUB_USERNAME,
  GITHUB_PASSWORD,
  GITHUB_PROFILE_NAME,
  GITHUB_TOPT_SECRET,
  DISPLAY,
};

export { env };

import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

function assert<T>(value: T | null | undefined): T {
  if (value == null) {
    throw new Error(`${value} es NULL!`);
  }

  return value;
}

const LEETCODE_SERVICE_COOKIE_DIR = assert(
  process.env.LEETCODE_SERVICE_COOKIE_DIR,
);
const LEETCODE_SERVICE_MOCK_DIR = assert(process.env.LEETCODE_SERVICE_MOCK_DIR);
const LEETCODE_PROFILE_NAME = assert(process.env.LEETCODE_PROFILE_NAME);
const GITHUB_USERNAME = assert(process.env.GITHUB_USERNAME);
const GITHUB_PASSWORD = assert(process.env.GITHUB_PASSWORD);
const GITHUB_TOPT_SECRET = assert(process.env.GITHUB_TOPT_SECRET);
const GITHUB_PROFILE_NAME = assert(process.env.GITHUB_PROFILE_NAME);

const env = {
  PORT: process.env.PORT || 6778,
  LEETCODE_SERVICE_COOKIE_DIR,
  LEETCODE_SERVICE_MOCK_DIR,
  LEETCODE_PROFILE_NAME,
  GITHUB_USERNAME,
  GITHUB_PASSWORD,
  GITHUB_PROFILE_NAME,
  GITHUB_TOPT_SECRET,
};

export { env };

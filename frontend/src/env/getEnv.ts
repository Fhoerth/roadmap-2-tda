import { assert } from '../utils/assert';

type Env = {
  VITE_API_BASE_URL: string;
};

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | null;

assert(VITE_API_BASE_URL);

console.log({
  VITE_API_BASE_URL,
});

export const env: Env = {
  VITE_API_BASE_URL,
};

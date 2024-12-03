import { assert } from './utils/assert';

type Env = {
  BACKEND_URL: string;
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string | null;

assert(BACKEND_URL);

console.log({
  BACKEND_URL,
});

export const env: Env = {
  BACKEND_URL,
};

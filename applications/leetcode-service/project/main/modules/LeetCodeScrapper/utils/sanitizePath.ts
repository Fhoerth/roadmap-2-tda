import { existsSync } from 'fs';
import { isAbsolute, resolve } from 'path';

function sanitizePath(inputPath: string): string {
  if (!isAbsolute(inputPath)) {
    throw new Error('Path must be absolute.');
  }

  const resolvedPath = resolve(inputPath);

  if (!existsSync(resolvedPath)) {
    throw new Error('File does not exist.');
  }

  return resolvedPath;
}

export { sanitizePath };

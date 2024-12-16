import type { NextFunction, Request, Response } from 'express';

import { LeetCodeError } from '../../modules/LeetCodeScrapper/errors/LeetCodeError';

function leetCodeErrorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (error instanceof LeetCodeError) {
    response.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  } else {
    next(error);
  }
}

export { leetCodeErrorHandler };

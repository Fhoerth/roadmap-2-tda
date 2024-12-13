import { NextFunction, Request, Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { LeetCodeError } from '../../modules/LeetCodeScrapper/errors/LeetCodeError';

function leetCodeErrorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof LeetCodeError) {
    res.status(error.status).json(error);
  } else {
    const status = StatusCodes.INTERNAL_SERVER_ERROR;
    const message =
      error instanceof Error
        ? error.message
        : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
    res.status(status).json({ status, message });
  }
}

export { leetCodeErrorHandler };

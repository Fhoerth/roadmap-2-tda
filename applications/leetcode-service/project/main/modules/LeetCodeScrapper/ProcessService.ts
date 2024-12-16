import type { Response } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { Dequeue } from '../Dequeue';
import { LeetCodeError } from './errors/LeetCodeError';

class ProcessService {
  readonly #ERROR_CODE = 1;
  readonly #pendingResponses: Dequeue<Response>;

  constructor() {
    this.#pendingResponses = new Dequeue<Response>();
  }

  public addPendingResponse(response: Response): () => void {
    const node = this.#pendingResponses.pushRight(response);
    return () => this.#pendingResponses.removeNode(node);
  }

  public terminate(error: unknown): void {
    this.#pendingResponses.forEach((response) => {
      if (error instanceof LeetCodeError) {
        response.status(error.status).json(error);
      } else {
        const status = StatusCodes.INTERNAL_SERVER_ERROR;
        const message =
          error instanceof Error
            ? error.message
            : getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
        response.status(status).json({ status, message });
      }
    });
    process.exit(this.#ERROR_CODE);
  }
}

const processService = new ProcessService();

export { ProcessService };
export { processService };

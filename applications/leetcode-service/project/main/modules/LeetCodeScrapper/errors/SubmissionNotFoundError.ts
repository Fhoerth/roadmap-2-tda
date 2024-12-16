import { StatusCodes } from 'http-status-codes';

import { SubmissionId } from '../types/SubmissionId';
import { LeetCodeError } from './LeetCodeError';

class SubmissionNotFoundError extends LeetCodeError {
  public status: number;
  public message: string;

  constructor(submissionId: SubmissionId) {
    const status = StatusCodes.NOT_FOUND;
    const message = `Submission "${submissionId}" not found.`;

    super(status, message);

    this.status = status;
    this.message = message;
  }
}

export { SubmissionNotFoundError };

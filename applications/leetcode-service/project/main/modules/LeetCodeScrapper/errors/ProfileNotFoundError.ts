import { StatusCodes } from 'http-status-codes';

import { LeetCodeError } from './LeetCodeError';

class ProfileNotFoundError extends LeetCodeError {
  public status: number;
  public message: string;

  constructor(username: string) {
    const status = StatusCodes.NOT_FOUND;
    const message = `Profile "${username}" not found.`;

    super(status, message);

    this.status = status;
    this.message = message;
  }
}

export { ProfileNotFoundError };

import { StatusCodes } from 'http-status-codes';

class LeetCodeError extends Error {
  public status = 404;
  public message: string;

  constructor(status: StatusCodes, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export { LeetCodeError };

import { StatusCodes } from 'http-status-codes';

class LeetCodeError extends Error {
  public status: number;
  public message: string;

  constructor(status: StatusCodes, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export { LeetCodeError };

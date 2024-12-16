import { StatusCodes } from 'http-status-codes';

import { LeetCodeError } from './LeetCodeError';

class LoginRequiredError extends LeetCodeError {
  constructor() {
    super(StatusCodes.INTERNAL_SERVER_ERROR, 'Login Required');
  }
}

export { LoginRequiredError };

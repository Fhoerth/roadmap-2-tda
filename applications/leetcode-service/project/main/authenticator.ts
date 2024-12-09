import { authenticator } from 'otplib';

function getTotpCode(): string {
  const secret = 'VTEDLIH5WRVXPR76';
  return authenticator.generate(secret);
}

export { getTotpCode };

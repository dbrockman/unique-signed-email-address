import { createHmac } from 'crypto';
import { encodeBase36 } from './base36';

export interface SignEmailWithNonceParams {
  baseEmail: string;
  description: string;
  nonce: Buffer;
  hmacByteLength: number;
}

export function signEmailWithNonce(
  secret: string | Buffer,
  { baseEmail, description, nonce, hmacByteLength }: SignEmailWithNonceParams,
): string {
  const [emailAccount, emailHost] = baseEmail.split('@');
  const signature = getSignature(secret, emailAccount, emailHost, nonce, description, hmacByteLength);
  return formatEmail(emailAccount, description, signature, emailHost);
}

function getSignature(
  secret: string | Buffer,
  emailAccount: string,
  emailHost: string,
  nonce: Buffer,
  description: string,
  hmacByteLength: number,
): string {
  const nonceHex = nonce.toString('hex');
  const hmacBasis = formatEmail(emailAccount, description, nonceHex, emailHost);
  const hmac = digest(secret, hmacBasis);
  const hmacBytes = Math.min(hmacByteLength, hmac.length);
  const buffer = concatSignature(nonce, hmac, hmacBytes);
  return encodeBase36(buffer);
}

function digest(secret: string | Buffer, basis: string): Buffer {
  return createHmac('sha256', secret)
    .update(basis, 'utf8')
    .digest();
}

function concatSignature(nonce: Buffer, hmac: Buffer, hmacBytes: number): Buffer {
  const buffer = Buffer.alloc(1 + nonce.length + hmacBytes);
  let offset = buffer.writeUInt8(nonce.length, 0);
  offset += nonce.copy(buffer, offset);
  hmac.copy(buffer, offset, 0, hmacBytes);
  return buffer;
}

function formatEmail(emailAccount: string, description: string, signature: string, emailHost: string): string {
  return `${emailAccount}+${description}-${signature}@${emailHost}`;
}

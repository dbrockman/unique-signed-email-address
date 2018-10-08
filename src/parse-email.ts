import { decodeBase36 } from './base36';
import { SignEmailWithNonceParams } from './sign-email';

export const descriptionPattern = /^[0-9a-z._-]+$/;

export const signedEmailPattern = /^([^+@]+)\+([0-9a-z._-]+)-([0-9a-z]+)@([^@]+)$/;

export function parseEmail(signedEmail: string): SignEmailWithNonceParams | undefined {
  const parts = signedEmailPattern.exec(signedEmail);
  if (!parts) {
    return;
  }
  const [, emailAccount, description, signature, emailHost] = parts;
  const buf = decodeBase36(signature);
  if (buf.length === 0) {
    return;
  }
  const nonceByteLength = buf.readUInt8(0);
  const hmacByteLength = buf.length - 1 - nonceByteLength;
  if (nonceByteLength === 0 || hmacByteLength <= 0) {
    return;
  }
  const nonce = buf.slice(1, 1 + nonceByteLength);
  const baseEmail = `${emailAccount}@${emailHost}`;
  return {
    baseEmail,
    description,
    hmacByteLength,
    nonce,
  };
}

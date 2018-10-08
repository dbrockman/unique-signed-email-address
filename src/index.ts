import { randomBytes } from 'crypto';
import ow from 'ow';
import { descriptionPattern, parseEmail, signedEmailPattern } from './parse-email';
import { signEmailWithNonce } from './sign-email';

const checkSecret = ow.create(ow.any(ow.string, ow.buffer));
const checkBaseEmail = ow.create(ow.string.label('baseEmail').matches(/^[^+@]+@[^@]+$/));
const checkDescription = ow.create(ow.string.label('description').matches(descriptionPattern));
const checkSignedEmail = ow.create(ow.string.label('signedEmail').matches(signedEmailPattern));

export interface SignEmailParams {
  secret: string | Buffer;
  baseEmail: string;
  description: string;
  nonceByteLength?: number;
  hmacByteLength?: number;
}

export function signEmail({
  secret,
  baseEmail,
  description,
  nonceByteLength = 3,
  hmacByteLength = 5,
}: SignEmailParams): string {
  checkSecret(secret);
  checkBaseEmail(baseEmail);
  checkDescription(description);
  ow(nonceByteLength, ow.number.label('nonceByteLength').integer.inRange(1, 255));
  ow(hmacByteLength, ow.number.label('hmacByteLength').integer.inRange(1, 32));

  const nonce = randomBytes(nonceByteLength);
  return signEmailWithNonce(secret, { baseEmail, nonce, description, hmacByteLength });
}

export interface VerifySignedEmailParams {
  secret: string | Buffer;
  signedEmail: string;
}

export function verifySignedEmail({ secret, signedEmail }: VerifySignedEmailParams): boolean {
  checkSecret(secret);
  checkSignedEmail(signedEmail);

  const parsed = parseEmail(signedEmail);
  return !!parsed && signedEmail === signEmailWithNonce(secret, parsed);
}

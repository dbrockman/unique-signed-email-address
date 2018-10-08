import { parseEmail } from '../parse-email';
import { signEmailWithNonce } from '../sign-email';

describe('parseEmail', () => {
  test('with a valid email', () => {
    const secret = 'test-secret';
    const baseEmail = 'my.name@gmail.com';
    const hmacByteLength = 4;
    const nonce = Buffer.from('feedface', 'hex');
    const description = 'example.com';

    const email = signEmailWithNonce(secret, { baseEmail, nonce, description, hmacByteLength });
    const parsed = parseEmail(email);

    expect(parsed).toEqual({
      baseEmail,
      description,
      hmacByteLength,
      nonce,
    });
  });

  test("with an email that doesn't match the pattern of a signed email", () => {
    const parsed = parseEmail('my.name@gmail.com');
    expect(parsed).toBe(undefined);
  });

  test('with an email that have an invalid signature', () => {
    const parsed = parseEmail('my.name+example.com-01eyr@gmail.com');
    expect(parsed).toBe(undefined);
  });
});

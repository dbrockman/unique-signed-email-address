import { signEmailWithNonce } from '../sign-email';

test('signEmailWithNonce', () => {
  const secret = 'test-secret';
  const nonce = Buffer.from('badcab', 'hex');
  const email = signEmailWithNonce(secret, {
    baseEmail: 'my.name@gmail.com',
    description: 'example.com',
    hmacByteLength: 5,
    nonce,
  });
  expect(email).toBe('my.name+example.com-eiqy5h73qc3v4@gmail.com');
});

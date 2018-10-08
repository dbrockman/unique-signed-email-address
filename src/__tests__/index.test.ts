import { signEmail, verifySignedEmail } from '..';

const secret = 'test-secret';

test('signEmail', () => {
  const signedEmail = signEmail({ secret, baseEmail: 'my.name@gmail.com', description: 'example.com' });
  expect(signedEmail).toMatch(/^my\.name\+example\.com-[0-9a-z]+@gmail\.com$/);
});

test('verifySignedEmail', () => {
  const signedEmail = signEmail({ secret, baseEmail: 'my.name@gmail.com', description: 'example.com' });
  expect(verifySignedEmail({ secret, signedEmail })).toBe(true);
});

import { decodeBase36, encodeBase36 } from '../base36';

test('encodeBase36', () => {
  const buf = Buffer.from('feedface', 'hex');
  const str = encodeBase36(buf);
  expect(str).toBe('1yqf5ce');
});

test('decodeBase36', () => {
  const buf = decodeBase36('1yqf5ce');
  expect(buf).toBeInstanceOf(Buffer);
  expect(buf.toString('hex')).toBe('feedface');
});

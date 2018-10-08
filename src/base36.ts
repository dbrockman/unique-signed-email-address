import baseX = require('base-x');

const { encode, decode } = baseX('0123456789abcdefghijklmnopqrstuvwxyz');

export function encodeBase36(buffer: Buffer): string {
  return encode(buffer);
}

export function decodeBase36(encoded: string): Buffer {
  return Buffer.from(decode(encoded));
}

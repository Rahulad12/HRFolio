import crypto from 'crypto';

export function generateRefreshToken() {
  return crypto.randomBytes(40).toString('hex');
}

export function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

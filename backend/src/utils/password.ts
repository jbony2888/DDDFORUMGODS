import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export function generateRandomPassword(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
  let result = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * chars.length);
    result += chars[idx];
  }
  return result;
}

export function hashPassword(plainText: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(plainText, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(plainText: string, storedHash: string): boolean {
  if (!storedHash) {
    return false;
  }

  const [salt, key] = storedHash.split(':');
  if (!salt || !key) {
    // Legacy entries stored without salt (plain text)
    if (plainText.length !== storedHash.length) {
      return false;
    }
    return timingSafeEqual(Buffer.from(plainText), Buffer.from(storedHash));
  }

  try {
    const derived = scryptSync(plainText, salt, 64);
    return timingSafeEqual(derived, Buffer.from(key, 'hex'));
  } catch {
    return false;
  }
}

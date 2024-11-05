import { randomUUID } from 'node:crypto';

export async function hello() {
  return randomUUID();
}

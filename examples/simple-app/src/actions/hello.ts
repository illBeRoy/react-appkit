import { randomUUID } from 'node:crypto';

export async function hello() {
  console.log('hello from main');
  return randomUUID();
}

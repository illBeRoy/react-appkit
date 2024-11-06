import { randomUUID } from 'node:crypto';

export async function helloWorld() {
  return `Hello from main! Let's generate a random uuid using "node:crypto" to proof that this code runs in the main process: ${randomUUID()}`;
}

export async function iThrow() {
  throw new Error('This is a test error');
}

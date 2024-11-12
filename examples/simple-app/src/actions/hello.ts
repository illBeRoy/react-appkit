import { showOpenDialog } from '@react-appkit/sdk/dialog';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

export async function helloWorld(name: string) {
  return `Hello from main, ${name}! Let's generate a random uuid using "node:crypto" to proof that this code runs in the main process: ${randomUUID()}`;
}

export async function iThrow() {
  throw new Error('This is a test error');
}

export async function selectAndReadAFile() {
  const file = await showOpenDialog();
  if (file.result === 'ok') {
    const content = await fs.readFile(file.paths[0], 'utf-8');
    return content;
  } else {
    return 'no file selected';
  }
}

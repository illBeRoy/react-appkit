import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'node:url';

export const templateFile = (filePath: string) =>
  fs.readFile(
    path.join(fileURLToPath(import.meta.url), '..', '..', 'template', filePath),
    'utf-8',
  );

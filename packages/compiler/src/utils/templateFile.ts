import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'node:url';

export const templateFile = (
  filePath: string,
  vars: Record<string, unknown> = {},
) => {
  let fileContents = fs.readFileSync(
    path.join(fileURLToPath(import.meta.url), '..', '..', 'template', filePath),
    'utf-8',
  );

  for (const [key, val] of Object.entries(vars)) {
    fileContents = fileContents.replaceAll(`[[${key}]]`, `${val}`);
  }

  return fileContents;
};

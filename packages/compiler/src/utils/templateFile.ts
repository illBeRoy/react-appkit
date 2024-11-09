import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'node:url';

export const templateFile = (
  filePath: string,
  vars: Record<string, unknown> = {},
) =>
  fs
    .readFile(
      path.join(
        fileURLToPath(import.meta.url),
        '..',
        '..',
        'template',
        filePath,
      ),
      'utf-8',
    )
    .then((fileContents) =>
      Object.entries(vars).reduce(
        (contents, [key, val]) => contents.replaceAll(`[[${key}]]`, `${val}`),
        fileContents,
      ),
    );

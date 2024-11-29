import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const pathInTemplateDir = (filePath: string) =>
  path.join(fileURLToPath(import.meta.url), '..', '..', 'template', filePath);

export const templateFile = (
  filePath: string,
  vars: Record<string, unknown> = {},
) => {
  let fileContents = fs.readFileSync(pathInTemplateDir(filePath), 'utf-8');

  for (const [key, val] of Object.entries(vars)) {
    fileContents = fileContents.replaceAll(`[[${key}]]`, `${val}`);
  }

  return fileContents;
};

export const templateDir = (
  dirPath: string,
  vars: Record<string, unknown> = {},
) => {
  const dirContents = fs.readdirSync(pathInTemplateDir(dirPath));
  return Object.fromEntries(
    dirContents.map((file) => [
      `./${file}`,
      templateFile(path.join(dirPath, file), vars),
    ]),
  );
};

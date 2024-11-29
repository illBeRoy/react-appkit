import path from 'path';
import fs from 'fs/promises';
import { templateFile } from './template';

export async function assertAppConfigExists(workDir: string) {
  const appConfigFile = path.join(workDir, 'app.config.ts');

  const appConfigExists = fs
    .access(appConfigFile)
    .then(() => true)
    .catch(() => false);

  if (!appConfigExists) {
    console.warn(
      'Could not find an app config in your project. Created an "app.config.ts" file, please review it and then try again',
    );
    await fs.writeFile(appConfigFile, await templateFile('app.config.ts'));
    process.exit(1);
  }
}

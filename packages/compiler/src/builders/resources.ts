import path from 'node:path';
import fs from 'node:fs/promises';
import * as vite from 'vite';

export async function buildResources(workDir: string) {
  const resourcesDir = path.join(workDir, 'dist', 'resources');
  await fs.mkdir(resourcesDir, { recursive: true });

  await vite.build({
    root: workDir,
    configFile: false,
    build: {
      outDir: resourcesDir,
      target: 'node20',
      lib: {
        formats: ['cjs'],
        entry: './app.config.ts',
        fileName: 'app.config',
      },
    },
  });

  const maybeIconFile = path.join(workDir, 'icon.png');
  await fs
    .copyFile(maybeIconFile, path.join(resourcesDir, 'icon.png'))
    .catch(() =>
      console.warn(
        'Could not find icon file to be used as the app icon. This will work, but we recommend that you create an "icon.png" file in the root of your project.',
      ),
    );
}

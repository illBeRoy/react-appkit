import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

export interface AppScaffoldParams {
  appName: string;
  appId: string;
  packageName: string;
}

const execAsync = promisify(exec);

export async function createAppDirectory({
  atDir,
  params,
  pkgManager,
}: {
  atDir: string;
  params: AppScaffoldParams;
  pkgManager: 'npm' | 'yarn' | 'pnpm' | 'bun';
}) {
  // Check if directory exists
  if (existsSync(atDir)) {
    throw new Error(`Directory ${atDir} already exists`);
  }

  // Create directory
  await fs.mkdir(atDir, { recursive: true });

  // Copy template directory
  const templateDir = path.join(__dirname, '..', 'template');
  await copyDir(templateDir, atDir);

  // Replace parameters in all files
  await embedUserValuesInSourceFiles(atDir, params);

  // Rename pkg.json to package.json
  const pkgJsonPath = path.join(atDir, 'pkg.json');
  const newPkgJsonPath = path.join(atDir, 'package.json');
  await fs.rename(pkgJsonPath, newPkgJsonPath);

  // Install dependencies
  const installCommand = getInstallCommand(pkgManager);
  await execAsync(installCommand, { cwd: atDir });
}

async function copyDir(src: string, dest: string) {
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function embedUserValuesInSourceFiles(
  dir: string,
  params: AppScaffoldParams,
) {
  const supportedExtensions = ['ts', 'tsx', 'js', 'jsx', 'json'];
  const entries = await fs.readdir(dir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await embedUserValuesInSourceFiles(fullPath, params);
      } else {
        if (supportedExtensions.includes(entry.name.split('.').pop()!)) {
          let content = await fs.readFile(fullPath, 'utf-8');

          content = content
            .replace(/\[\[APP_NAME\]\]/g, params.appName)
            .replace(/\[\[APP_ID\]\]/g, params.appId)
            .replace(/\[\[PKG_NAME\]\]/g, params.packageName);

          await fs.writeFile(fullPath, content, 'utf-8');
        }
      }
    }),
  );
}

function getInstallCommand(
  pkgManager: 'npm' | 'yarn' | 'pnpm' | 'bun',
): string {
  switch (pkgManager) {
    case 'npm':
      return 'npm install';
    case 'yarn':
      return 'yarn';
    case 'pnpm':
      return 'pnpm install';
    case 'bun':
      return 'bun install';
  }
}

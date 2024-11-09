#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import electronBuilder from 'electron-builder';
import { AppConfigSchema } from '../../runtime/src/shared/config'; // temp fix: since we're running bun build --packages external, we're using relative import instead of package name to trick bun to bundle it with the script
import { build } from './build';
import { templateFile } from './utils/templateFile';
import assert from 'node:assert';
import { parseArgs } from 'node:util';

export async function pack(
  workDir: string,
  { skipBuild } = { skipBuild: false },
) {
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

  if (!skipBuild) {
    await build(workDir);
  }

  const configModule = await import(
    path.join(workDir, 'dist', 'resources', 'app.config.js')
  );

  const appConfig = AppConfigSchema.safeParse(configModule.default);
  if (!appConfig.success) {
    console.error(
      'Your app config is invalid. Please review the "app.config.ts" file.\n' +
        `Reason:\n${appConfig.error.errors.map((err) => `  ${err.path.length ? `at ${err.path.join('.')}: ` : ''}${err.message}`).join('\n')}`,
    );
    process.exit(1);
  }

  const electronVersion = await fs
    .readFile(
      path.join(path.dirname(require.resolve('electron')), 'package.json'),
      'utf-8',
    )
    .then((str) => JSON.parse(str))
    .then((pkgJson) => pkgJson.version)
    .then((ver) => {
      assert(typeof ver === 'string');
      return ver;
    });

  let targets = new Map();
  appConfig.data.buildTargets?.forEach((target) => {
    switch (target) {
      case 'win':
        targets = new Map([
          ...targets,
          ...electronBuilder.Platform.WINDOWS.createTarget(),
        ]);
        return;
      case 'mac':
        targets = new Map([
          ...targets,
          ...electronBuilder.Platform.MAC.createTarget(),
        ]);
        return;
      case 'linux':
        targets = new Map([
          ...targets,
          ...electronBuilder.Platform.LINUX.createTarget(),
        ]);
        return;
      default:
        throw new Error(`Unsupported target platform: ${target}`);
    }
  });

  if (targets.size === 0) {
    targets = electronBuilder.Platform.current().createTarget();
  }

  await electronBuilder.build({
    projectDir: workDir,
    config: {
      appId: appConfig.data.id,
      productName: appConfig.data.displayName,
      icon: './dist/resources/icon.png',
      files: ['dist/main', 'dist/preload', 'dist/renderer', 'dist/resources'],
      electronVersion,
      directories: {
        output: './dist/packages',
        buildResources: './dist/resources',
      },
    },
    targets,
  });
}

if (require.main === module) {
  const args = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      skipBuild: {
        type: 'boolean',
        short: 's',
      },
    },
  });

  pack(process.cwd(), { skipBuild: args.values.skipBuild ?? false }).catch(
    (error) => {
      console.error(
        error instanceof Error ? `[${error.name}] ${error.message}` : error,
      );
      process.exit(1);
    },
  );
}

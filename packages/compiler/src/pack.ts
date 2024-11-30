#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import assert from 'node:assert';
import { parseArgs } from 'node:util';
import electronBuilder from 'electron-builder';
import { AppConfigSchema } from '../../runtime/src/shared/config'; // temp fix: since we're running bun build --packages external, we're using relative import instead of package name to trick bun to bundle it with the script
import { templateFile } from './utils/template';
import { buildAllForProduction } from './builders';
import chalk from 'chalk';

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
    await buildAllForProduction(workDir);
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

  const prePackageDir = path.join(workDir, '.bin');

  await fs.rm(prePackageDir, { recursive: true, force: true });
  await fs.mkdir(prePackageDir, { recursive: true });
  await fs.mkdir(path.join(prePackageDir, 'dist'), { recursive: true });
  await Promise.all([
    await fs.cp(
      path.join(workDir, 'dist', 'main'),
      path.join(prePackageDir, 'dist', 'main'),
      { recursive: true },
    ),
    await fs.cp(
      path.join(workDir, 'dist', 'preload'),
      path.join(prePackageDir, 'dist', 'preload'),
      { recursive: true },
    ),
    await fs.cp(
      path.join(workDir, 'dist', 'renderer'),
      path.join(prePackageDir, 'dist', 'renderer'),
      { recursive: true },
    ),
    await fs.writeFile(
      path.join(prePackageDir, 'package.json'),
      await templateFile('pkg.json', {
        appName: appConfig.data.displayName,
        pkgName: appConfig.data.displayName.replaceAll(' ', '-').toLowerCase(),
      }),
    ),
    await fs.writeFile(
      path.join(prePackageDir, 'index.js'),
      await templateFile('index.js'),
    ),
  ]);

  await electronBuilder.build({
    projectDir: prePackageDir,
    config: {
      appId: appConfig.data.id,
      productName: appConfig.data.displayName,
      icon: path.join(workDir, '/dist/resources/icon.png'),
      files: ['dist', 'index.js'],
      electronVersion,
      directories: {
        output: path.join(workDir, 'dist', 'binaries'),
        buildResources: path.join(workDir, 'dist', 'resources'),
      },
    },
    targets,
  });

  await fs.rm(prePackageDir, { recursive: true, force: true });

  console.log(
    '\n' +
      `Application binaries created ${chalk.green('successfully')} under ${chalk.bold.blueBright('dist/binaries')}! 🎉`,
  );
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

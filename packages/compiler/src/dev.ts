#!/usr/bin/env node

import { spawn as _spawn } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { rendererBuilder } from './builders/renderer';
import { mainBuilder } from './builders/main';
import { createDevServer } from '../../dev-server/src/server';

const spawn = promisify(_spawn);

export async function dev(workDir: string) {
  const rendererPort = 3000;
  const mainPort = 3001;

  const rendererWatcher = await rendererBuilder(workDir).buildForDev({
    devServerPort: rendererPort,
  });

  const devServer = createDevServer({ port: rendererPort });
  await devServer.awaitReady();

  rendererWatcher.on('event', (event) => {
    if (event.code === 'BUNDLE_END') {
      console.log(event.input);
      devServer.send.reload();
    }
  });

  await mainBuilder(workDir).buildForProduction();

  const electronExecutable = path.join(
    path.dirname(require.resolve('electron')),
    'cli.js',
  );

  await spawn(electronExecutable, ['.'], {
    cwd: workDir,
    stdio: 'inherit',
  });

  await devServer.close();
}

if (require.main === module) {
  dev(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

#!/usr/bin/env node

import { spawn as _spawn } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import getPort from 'get-port';
import { clean } from './builders';
import { rendererBuilder } from './builders/renderer';
import { mainBuilder } from './builders/main';
import { buildResources } from './builders/resources';
import { buildPreload } from './builders/preload';

const spawn = promisify(_spawn);

export async function dev(workDir: string) {
  await clean(workDir);

  await Promise.all([buildPreload(workDir), buildResources(workDir)]);

  const rendererPort = await getPort({ port: 3000 });

  const rendererDevServer =
    await rendererBuilder(workDir).createDevServer(rendererPort);

  await rendererDevServer.listen();

  const mainProcessWatcher = await mainBuilder(workDir).buildAndWatch({
    rendererDevServerUrl: `http://localhost:${rendererPort}`,
  });

  mainProcessWatcher.on('event', (e) => {
    if (e.code === 'BUNDLE_END') {
      console.log('main process bundle built', e.input);
    }
  });

  const electronExecutable = path.join(
    path.dirname(require.resolve('electron')),
    'cli.js',
  );

  await spawn(electronExecutable, ['.'], {
    cwd: workDir,
    stdio: 'inherit',
  });

  await Promise.all([mainProcessWatcher.close(), rendererDevServer.close()]);
}

if (require.main === module) {
  dev(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

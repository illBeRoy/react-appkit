#!/usr/bin/env node

import { spawn as _spawn } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { rendererBuilder } from './builders/renderer';
import { mainBuilder } from './builders/main';

const spawn = promisify(_spawn);

export async function dev(workDir: string) {
  const rendererPort = 3000;
  const mainPort = 3001;

  const rendererDevServer =
    await rendererBuilder(workDir).createDevServer(rendererPort);

  await rendererDevServer.listen();

  await mainBuilder(workDir).createDevServer(mainPort, {
    rendererDevServerUrl: `http://localhost:${rendererPort}`,
  });

  const electronExecutable = path.join(
    path.dirname(require.resolve('electron')),
    'cli.js',
  );

  await spawn(electronExecutable, ['.'], {
    cwd: workDir,
    stdio: 'inherit',
  });

  await rendererDevServer.close();
}

if (require.main === module) {
  dev(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

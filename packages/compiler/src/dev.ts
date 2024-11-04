#!/usr/bin/env node

import { spawn as _spawn } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';

const spawn = promisify(_spawn);

export async function dev(workDir: string) {
  const electronExecutable = path.join(
    path.dirname(require.resolve('electron')),
    'cli.js',
  );

  await spawn(electronExecutable, ['.'], {
    cwd: workDir,
    stdio: 'inherit',
  });
}

if (require.main === module) {
  dev(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

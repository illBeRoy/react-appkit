#!/usr/bin/env node
import { buildMain } from './builders/main';
import { buildRenderer } from './builders/renderer';
import { buildPreload } from './builders/preload';
import { buildResources } from './builders/resources';

export async function build(workDir: string) {
  await Promise.all([
    buildMain(workDir),
    buildRenderer(workDir),
    buildPreload(workDir),
    buildResources(workDir),
  ]);
}

if (require.main === module) {
  build(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

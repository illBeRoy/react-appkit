#!/usr/bin/env node
import { buildAll } from './builders';

export async function build(workDir: string) {
  return buildAll(workDir);
}

if (require.main === module) {
  build(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

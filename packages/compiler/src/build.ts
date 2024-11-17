#!/usr/bin/env node
import { buildAllForProduction } from './builders';
import { assertAppConfigExists } from './utils/config';

export async function build(workDir: string) {
  await assertAppConfigExists(workDir);
  return buildAllForProduction(workDir);
}

if (require.main === module) {
  build(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

import path from 'node:path';
import { createApp } from '@react-appkit/runtime/entrypoints/main';

async function main() {
  const userApis: Record<string, unknown> = {};

  const srcActionsAllModules = await import.meta.glob('./src/actions/*.ts');

  Object.entries(srcActionsAllModules).forEach(async ([filename, module]) => {
    const namespace = path.basename(filename, '.ts');
    const allExported = (await module()) as Record<string, unknown>; // all modules in the API folder are ESM so we can assume they're all Records

    Object.entries(allExported).forEach(([fnName, exported]) => {
      userApis[`${namespace}.${fnName}`] = exported;
    });
  });

  await createApp({ userApis }).start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

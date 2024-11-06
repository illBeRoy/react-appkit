import {
  createApp,
  type AppConfig,
} from '@react-appkit/runtime/entrypoints/main';

async function main() {
  const config: AppConfig = {};

  const srcActionsAllModules = await import.meta.glob('./src/actions/*.ts');

  config.userActions = [];

  Object.entries(srcActionsAllModules).forEach(async ([filename, module]) => {
    const allExported = (await module()) as Record<string, unknown>; // all modules in the API folder are ESM so we can assume they're all Records

    Object.entries(allExported).forEach(([fnName, exported]) => {
      config.userActions?.push({
        fileName: filename,
        exportedValueName: fnName,
        exportedValue: exported,
      });
    });
  });

  await createApp(config).start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

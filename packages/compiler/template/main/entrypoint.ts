import { createApp, type AppConfig } from '@react-appkit/runtime/main/app';

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

  const maybeTrayModule = import.meta.glob('./src/tray.tsx');
  if (maybeTrayModule?.['./src/tray.tsx']) {
    const trayModule = await maybeTrayModule['./src/tray.tsx']();

    if (
      !trayModule ||
      typeof trayModule !== 'object' ||
      !('default' in trayModule)
    ) {
      throw new Error(
        'The ./src/tray.tsx file must export a default component that contains the <Tray /> component.',
      );
    }

    config.trayComponent = trayModule.default as React.ComponentType;
  }

  await createApp(config).start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

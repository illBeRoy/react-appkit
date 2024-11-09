import { createApp, type AppConfig } from '@react-appkit/runtime/main/app';

async function main() {
  const config: AppConfig = {};

  const srcActionsAllModules = import.meta.glob('./src/actions/*.ts');

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

  const maybeHotkeysModule = import.meta.glob('./src/hotkeys.ts');
  if (maybeHotkeysModule?.['./src/hotkeys.ts']) {
    const hotkeysModule = await maybeHotkeysModule['./src/hotkeys.ts']();

    if (
      !hotkeysModule ||
      typeof hotkeysModule !== 'object' ||
      !('default' in hotkeysModule) ||
      !hotkeysModule.default ||
      typeof hotkeysModule.default !== 'object' ||
      !('build' in hotkeysModule.default) ||
      typeof hotkeysModule.default.build !== 'function'
    ) {
      throw new Error(
        'The ./src/hotkeys.ts file must export a hotkeys builder. Example:\n\nimport { hotkeys } from "@react-appkit/sdk/hotkeys";\n\nexport default hotkeys()\n  .addHotkey(["CmdOrCtrl", "H"], () => console.log("Hello, world"));\n',
      );
    }

    config.hotkeys = hotkeysModule.default.build();
  }

  const maybeStartupModule = import.meta.glob('./src/startup.ts');
  if (maybeStartupModule?.['./src/startup.ts']) {
    const startupModule = await maybeStartupModule['./src/startup.ts']();
    if (
      startupModule &&
      typeof startupModule === 'object' &&
      'default' in startupModule &&
      typeof startupModule.default === 'function'
    ) {
      config.startupFunction =
        startupModule.default as () => void | Promise<void>;
    } else {
      throw new Error(
        'The ./src/startup.ts file must export a default function. The function may be async. The function is called before the app starts running.',
      );
    }
  }

  await createApp(config).start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

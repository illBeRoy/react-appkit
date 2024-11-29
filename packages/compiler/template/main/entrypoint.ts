import {
  createApp,
  type AppRuntimeOptions,
} from '@react-appkit/runtime/main/app';
import path from 'node:path';
import { AppConfigSchema } from '@react-appkit/runtime/shared/config';

async function main() {
  const opts: AppRuntimeOptions = {};

  opts.userActions = await import('./actions').then(
    (exported) => exported.userActions,
  );

  // collect tray component
  opts.trayComponent = await import('./tray').then(
    (exported) => exported.TrayComponent,
  );

  // collect application menu component
  opts.applicationMenuComponent = await import('./applicationMenu').then(
    (exported) => exported.ApplicationMenuComponent,
  );

  // collect hotkeys builder
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

    opts.hotkeys = hotkeysModule.default.build();
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
      opts.startupFunction =
        startupModule.default as () => void | Promise<void>;
    } else {
      throw new Error(
        'The ./src/startup.ts file must export a default function. The function may be async. The function is called before the app starts running.',
      );
    }
  }

  const appConfig = AppConfigSchema.parse(
    // @ts-expect-error this file should always exist in the project directory (otherwise the app wouldn't build)
    await import('./app.config.ts').then((exported) => exported.default),
  );

  opts.singleInstance = appConfig.singleInstance ?? false;

  // if renderer dev server url was supplied by vite, utilize it
  // @ts-expect-error this is defined by vite during build time
  if (typeof __REACT_APPKIT_RENDERER_DEV_SERVER_URL === 'string') {
    // @ts-expect-error same as above
    opts.rendererDevServerUrl = __REACT_APPKIT_RENDERER_DEV_SERVER_URL;
  }

  // if hmr files base path was supplied by vite, tell the runtime to watch for changes for dynamic files
  // @ts-expect-error this is defined by vite during build time
  if (typeof __HMR_FILES_BASE_PATH === 'string') {
    opts.hmr = {
      // @ts-expect-error same as above
      userActionsFile: path.join(__HMR_FILES_BASE_PATH, 'actions.chunk.js'),
      // @ts-expect-error same as above
      trayFile: path.join(__HMR_FILES_BASE_PATH, 'tray.chunk.js'),
    };
  }

  await createApp(opts).start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

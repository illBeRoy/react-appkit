import { app } from 'electron';
import { createActionsRegistry } from '../main/actionsRegistry';
import { exposeBuiltinApisAsActionsInto } from '../main/builtinApis';
import { createNewWindow } from '../main/api/window';
import { startIpcBridge } from '../main/ipcBridge';

export interface AppConfig {
  userActions?: Array<{
    fileName: string;
    exportedValueName: string;
    exportedValue: unknown;
  }>;
}

export function createApp(config: AppConfig) {
  async function start() {
    app.whenReady().then(async () => {
      const actionsRegistry = createActionsRegistry();

      await exposeBuiltinApisAsActionsInto(actionsRegistry);

      if (config.userActions) {
        config.userActions.forEach(
          ({ fileName, exportedValueName, exportedValue }) => {
            actionsRegistry.registerAction(
              'user',
              fileName,
              exportedValueName,
              exportedValue,
            );
          },
        );
      }

      startIpcBridge(actionsRegistry);

      await createNewWindow('/');
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  return { start };
}

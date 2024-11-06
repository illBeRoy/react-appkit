import { app } from 'electron';
import { createActionsRegistry } from './actionsEngine/actionsRegistry';
import { exposeBuiltinApisAsActionsInto } from './builtinApis';
import { createNewWindow } from './api/window';
import { startIpcBridge } from './actionsEngine/ipcBridge';
import { renderTray } from './tray/renderer';

export interface AppConfig {
  userActions?: Array<{
    fileName: string;
    exportedValueName: string;
    exportedValue: unknown;
  }>;
  trayComponent?: React.ComponentType;
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

      if (config.trayComponent) {
        renderTray(config.trayComponent);
      }

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

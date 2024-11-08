import { app, BrowserWindow } from 'electron';
import { createActionsRegistry } from './actionsEngine/registry';
import { renderTray } from './tray/renderer';
import { registerHotkeys } from './hotkeys/registerHotkeys';
import { exposeBuiltinApisAsActionsInto } from './builtinApis';
import { createNewWindow } from './api/window';
import { startIpcBridge } from './actionsEngine/ipcBridge';
import { globalStateUpdatesPublisher } from './globalState/store';

export interface AppConfig {
  userActions?: Array<{
    fileName: string;
    exportedValueName: string;
    exportedValue: unknown;
  }>;
  trayComponent?: React.ComponentType;
  hotkeys?: Map<string, () => void | Promise<void>>;
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

      if (config.hotkeys) {
        registerHotkeys(config.hotkeys);
      }

      startIpcBridge(actionsRegistry);

      globalStateUpdatesPublisher.on('change', () =>
        BrowserWindow.getAllWindows().forEach((window) =>
          window.webContents.send('globalStateChange'),
        ),
      );

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

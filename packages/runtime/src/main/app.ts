import { app, BrowserWindow } from 'electron';
import { createActionsRegistry } from './actionsEngine/registry';
import { renderTray } from './tray/renderer';
import { registerHotkey, registerHotkeys } from './hotkeys/registerHotkeys';
import { exposeBuiltinApisAsActionsInto } from './builtinApis';
import { startIpcBridge } from './actionsEngine/ipcBridge';
import { globalStateUpdatesPublisher } from './globalState/store';
import { windowManager } from './windows/windowManager';
import { renderApplicationMenu } from './menu/applicationMenu/renderer';
import { EmptyMenu } from './menu/applicationMenu/components';

export interface AppRuntimeOptions {
  userActions?: Array<{
    fileName: string;
    exportedValueName: string;
    exportedValue: unknown;
  }>;
  trayComponent?: React.ComponentType;
  applicationMenuComponent?: React.ComponentType;
  hotkeys?: Map<string, () => void | Promise<void>>;
  startupFunction?: () => void | Promise<void>;
  singleInstance?: boolean;
  openWindowOnStartup?: boolean;
}

export function createApp(opts: AppRuntimeOptions) {
  function start() {
    if (opts.singleInstance) {
      const gotTheLock = app.requestSingleInstanceLock();

      if (!gotTheLock) {
        app.quit();
      }

      app.on('second-instance', () => {
        const mainWindowIfExists = windowManager.getWindow({
          atChannel: '_top',
        });

        if (mainWindowIfExists) {
          mainWindowIfExists.focus();
        } else {
          windowManager.openWindow('/', { channel: '_top' });
        }
      });
    }

    app.whenReady().then(async () => {
      const actionsRegistry = createActionsRegistry();

      await exposeBuiltinApisAsActionsInto(actionsRegistry);

      if (opts.userActions) {
        opts.userActions.forEach(
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

      if (opts.startupFunction) {
        await opts.startupFunction();
      }

      if (process.platform === 'darwin') {
        registerHotkey('CmdOrCtrl+Q', () => app.quit());
      }

      if (opts.hotkeys) {
        registerHotkeys(opts.hotkeys);
      }

      startIpcBridge(actionsRegistry);

      globalStateUpdatesPublisher.on('change', () =>
        BrowserWindow.getAllWindows().forEach((window) =>
          window.webContents.send('globalStateChange'),
        ),
      );

      if (opts.trayComponent) {
        renderTray(opts.trayComponent);
      }

      renderApplicationMenu(opts.applicationMenuComponent ?? EmptyMenu);

      if (opts.openWindowOnStartup !== false) {
        windowManager.openWindow('/', { channel: '_top' });
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  return { start };
}

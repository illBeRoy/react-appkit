import { app, BrowserWindow } from 'electron';
import { createActionsRegistry } from './actionsEngine/registry';
import { wrapTray } from './tray/wrapper';
import { registerHotkey, registerHotkeys } from './hotkeys/registerHotkeys';
import { exposeBuiltinApisAsActionsInto } from './builtinApis';
import { startIpcBridge } from './actionsEngine/ipcBridge';
import { globalStateUpdatesPublisher } from './globalState/store';
import { windowManager } from './windows/windowManager';
import { wrapApplicationMenu } from './menu/applicationMenu/wrapper';
import { EmptyMenu } from './menu/applicationMenu/components';
import { renderInNode } from './nodeRenderer/renderer';
import { startHmrOnModule } from './hmr';

type UserAction = {
  fileName: string;
  exportedValueName: string;
  exportedValue: unknown;
};

export interface AppRuntimeOptions {
  userActions?: UserAction[];
  trayComponent?: React.ComponentType;
  applicationMenuComponent?: React.ComponentType;
  hotkeys?: Map<string, () => void | Promise<void>>;
  startupFunction?: () => void | Promise<void>;
  singleInstance?: boolean;
  openWindowOnStartup?: boolean;
  rendererDevServerUrl?: string;
  hmr?: { userActionsFile: string; trayFile: string };
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
      if (opts.rendererDevServerUrl) {
        windowManager.withDevServerUrl(opts.rendererDevServerUrl);
      }

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
        registerHotkey('CmdOrCtrl+Q', () => {
          app.quit();
        });
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

      const TrayBaseComponent = wrapTray(opts.trayComponent ?? null);

      const ApplicationMenuBaseComponent = wrapApplicationMenu(
        opts.applicationMenuComponent ?? EmptyMenu,
      );

      renderInNode(TrayBaseComponent.Component, ApplicationMenuBaseComponent);

      if (opts.hmr) {
        const actionsWatcher = startHmrOnModule(
          opts.hmr.userActionsFile,
          (newActionsModule) => {
            actionsRegistry.unregisterAll('user');

            (newActionsModule.userActions as UserAction[]).forEach(
              ({ fileName, exportedValueName, exportedValue }) => {
                actionsRegistry.registerAction(
                  'user',
                  fileName,
                  exportedValueName,
                  exportedValue,
                );
              },
            );
          },
        );

        const trayWatcher = startHmrOnModule(
          opts.hmr.trayFile,
          (newTrayModule) => {
            TrayBaseComponent.replace(
              (newTrayModule.TrayComponent as
                | React.ComponentType
                | undefined) ?? null,
            );
          },
        );

        app.on('will-quit', () => {
          actionsWatcher.stop();
          trayWatcher.stop();
        });
      }

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

import { app } from 'electron';
import { exposedApis } from '../main/exposedApis';
import { exposeBuiltinApis } from '../main/builtinApis';
import { createNewWindow } from '../main/api/window';
import {
  ValueNotAnActionError,
  ActionNotAsyncError,
} from '../main/userActions';
import { startIpcBridge } from '../main/ipcBridge';

export interface AppConfig {
  userApis?: Record<string, (...args: unknown[]) => unknown>;
}

export function createApp(config: AppConfig) {
  async function start() {
    app.whenReady().then(async () => {
      await exposeBuiltinApis(exposedApis);

      if (config.userApis) {
        Object.entries(config.userApis).forEach(([key, value]) => {
          if (typeof value !== 'function') {
            throw new ValueNotAnActionError(key);
          }

          if (value.constructor.name !== 'AsyncFunction') {
            throw new ActionNotAsyncError(key);
          }

          exposedApis.set(`user.${key}`, value);
        });
      }

      startIpcBridge(exposedApis);

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

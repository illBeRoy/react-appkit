import { app, ipcMain } from 'electron';
import { exposedApis } from '../main/exposedApis';
import { exposeBuiltinApis } from '../main/builtinApis';
import { attachCallerContextWhenCallingApiFromWindow } from '../main/context';
import { createNewWindow } from '../main/api/window';

app.whenReady().then(async () => {
  await exposeBuiltinApis(exposedApis);

  ipcMain.handle(
    'invokeMainProcessApi',
    (event, fnName: string, ...params: unknown[]) => {
      const fn = exposedApis.get(fnName);

      if (fn) {
        attachCallerContextWhenCallingApiFromWindow(event, fn, ...params);
      }
    },
  );

  createNewWindow('/');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

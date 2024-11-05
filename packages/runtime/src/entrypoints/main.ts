import { app, ipcMain } from 'electron';
import { exposedApis } from '../main/exposeApiToRenderer';
import { attachCallerContextWhenCallingApiFromWindow } from '../main/context';
import { createNewWindow } from '../main/api/window';

app.whenReady().then(async () => {
  const apis = await exposedApis();

  ipcMain.handle(
    'invokeMainProcessApi',
    (event, fnName: string, ...params: unknown[]) => {
      const fn = apis.get(fnName);

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

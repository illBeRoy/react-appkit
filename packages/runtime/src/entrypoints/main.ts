import path from 'node:path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { exposedApis } from '../main/exposeApiToRenderer';
import { attachCallerContextWhenCallingApiFromWindow } from '../main/context';

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

  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    center: true,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist/preload/index.js'),
      sandbox: false,
    },
  });

  if (process.env.DEV_TOOLS === 'true') {
    window.webContents.openDevTools();
  }

  window.loadFile('dist/renderer/index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

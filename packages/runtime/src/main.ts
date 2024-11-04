import { app, BrowserWindow } from 'electron';

app.whenReady().then(() => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: true,
    center: true,
    webPreferences: {
      // preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  });

  window.loadFile('dist/renderer/index.html');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

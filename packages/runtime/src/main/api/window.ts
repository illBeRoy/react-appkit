import { BrowserWindow, screen, app } from 'electron';
import path from 'node:path';
import { useSender } from '../context';

export class NoWindowError extends Error {
  name = 'NoWindowError';
  message = 'No window found';
}

const useCurrentWindow = () => {
  const sender = useSender();
  const window = BrowserWindow.fromWebContents(sender);

  if (!window) {
    throw new NoWindowError();
  }

  return window;
};

export const setTitle = (title: string) => {
  const window = useCurrentWindow();
  window.setTitle(title);
};

export const setSize = (width: number, height: number) => {
  const window = useCurrentWindow();
  window.setSize(width, height);
};

export const setPosition = (
  x: number | `${number}%`,
  y: number | `${number}%`,
  origin:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'center-left'
    | 'center-right' = 'top-left',
) => {
  const window = useCurrentWindow();
  const display = screen.getDisplayMatching(window.getBounds());
  const [originY, originX] = origin.split('-');

  const point = {
    x:
      typeof x === 'string'
        ? (display.workAreaSize.width * parseFloat(x.replace('%', ''))) / 100
        : x,
    y:
      typeof y === 'string'
        ? (display.workAreaSize.height * parseFloat(y.replace('%', ''))) / 100
        : y,
  };

  const offset = {
    x:
      originX === 'left'
        ? 0
        : originX === 'right'
          ? -window.getSize()[0]
          : -window.getSize()[0] / 2,
    y:
      originY === 'top'
        ? 0
        : originY === 'bottom'
          ? -window.getSize()[0]
          : -window.getSize()[0] / 2,
  };

  window.setPosition(
    Math.round(point.x + offset.x),
    Math.round(point.y + offset.y),
  );
};

export const centerWindow = () => {
  const window = useCurrentWindow();
  window.center();
};

export const setResizable = (resizable: boolean) => {
  const window = useCurrentWindow();
  window.setResizable(resizable);
};

export const setMovable = (movable: boolean) => {
  const window = useCurrentWindow();
  window.setMovable(movable);
};

export const setAlwaysOnTop = (alwaysOnTop: boolean) => {
  const window = useCurrentWindow();
  window.setAlwaysOnTop(alwaysOnTop);
};

export const setFullScreen = (fullScreen: boolean) => {
  const window = useCurrentWindow();
  window.setFullScreen(fullScreen);
};

export const setShowInTaskbar = (show: boolean) => {
  const window = useCurrentWindow();
  window.setSkipTaskbar(!show);
};

export const setClosable = (closable: boolean) => {
  const window = useCurrentWindow();
  window.setClosable(closable);
};

export const setMinimizable = (minimizable: boolean) => {
  const window = useCurrentWindow();
  window.setMinimizable(minimizable);
};

export const setMaximizable = (maximizable: boolean) => {
  const window = useCurrentWindow();
  window.setMaximizable(maximizable);
};

export const hide = () => {
  const window = useCurrentWindow();
  window.hide();
};

export const show = () => {
  const window = useCurrentWindow();
  window.show();
};

export const close = () => {
  const window = useCurrentWindow();
  window.close();
};

export const createNewWindow = (windowPath: string) => {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    center: true,
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist/preload/index.js'),
      sandbox: false,
    },
  });

  if (process.env.DEV_TOOLS === 'true') {
    window.webContents.openDevTools();
  }

  window.loadFile('dist/renderer/index.html', { hash: windowPath });

  return window;
};

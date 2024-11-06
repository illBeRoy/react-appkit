import { BrowserWindow, screen, app } from 'electron';
import path from 'node:path';
import { useSender } from '../actionsEngine/context';

class NoWindowError extends Error {
  name = 'NoWindowError';
  message = 'No window found';
}

export interface WindowHandler {
  id: number;
}

const useCurrentWindow = () => {
  const sender = useSender();
  const window = BrowserWindow.fromWebContents(sender);

  if (!window) {
    throw new NoWindowError();
  }

  return window;
};

const fromWindowHandler = (windowHandler: WindowHandler) => {
  const window = BrowserWindow.fromId(windowHandler.id);

  if (!window) {
    throw new NoWindowError();
  }

  return window;
};

export const setTitle = async (title: string) => {
  const window = useCurrentWindow();
  window.setTitle(title);
};

export const setSize = async (width: number, height: number) => {
  const window = useCurrentWindow();
  window.setSize(width, height);
};

export const setPosition = async (
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

export const centerWindow = async () => {
  const window = useCurrentWindow();
  window.center();
};

export const setResizable = async (resizable: boolean) => {
  const window = useCurrentWindow();
  window.setResizable(resizable);
};

export const setMovable = async (movable: boolean) => {
  const window = useCurrentWindow();
  window.setMovable(movable);
};

export const setAlwaysOnTop = async (alwaysOnTop: boolean) => {
  const window = useCurrentWindow();
  window.setAlwaysOnTop(alwaysOnTop);
};

export const setFullScreen = async (fullScreen: boolean) => {
  const window = useCurrentWindow();
  window.setFullScreen(fullScreen);
};

export const setShowInTaskbar = async (show: boolean) => {
  const window = useCurrentWindow();
  window.setSkipTaskbar(!show);
};

export const setClosable = async (closable: boolean) => {
  const window = useCurrentWindow();
  window.setClosable(closable);
};

export const setMinimizable = async (minimizable: boolean) => {
  const window = useCurrentWindow();
  window.setMinimizable(minimizable);
};

export const setMaximizable = async (maximizable: boolean) => {
  const window = useCurrentWindow();
  window.setMaximizable(maximizable);
};

export const hide = async (windowHandler?: WindowHandler) => {
  const window = windowHandler
    ? fromWindowHandler(windowHandler)
    : useCurrentWindow();

  window.hide();
};

export const show = async (windowHandler?: WindowHandler) => {
  const window = windowHandler
    ? fromWindowHandler(windowHandler)
    : useCurrentWindow();

  window.show();
};

export const close = async (windowHandler?: WindowHandler) => {
  const window = windowHandler
    ? fromWindowHandler(windowHandler)
    : useCurrentWindow();

  window.close();
};

export const createNewWindow = async (
  windowPath: string,
): Promise<WindowHandler> => {
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

  if (process.env.DEBUG_RENDERER === 'true') {
    window.show();
    window.webContents.openDevTools();
  }

  window.loadFile('dist/renderer/index.html', { hash: windowPath });

  return { id: window.id };
};

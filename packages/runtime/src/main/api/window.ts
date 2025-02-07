import { BrowserWindow, screen } from 'electron';
import { useSender } from '../actionsEngine/context';
import { windowManager, type WindowHandler } from '../windows/windowManager';

class NoWindowContextError extends Error {
  name = 'NoWindowContextError';
  message =
    'Cannot find current window context. Was this action called from a window component?';
}

const useCurrentWindow = () => {
  const sender = useSender();
  const window = BrowserWindow.fromWebContents(sender);

  if (!window) {
    throw new NoWindowContextError();
  }

  return window;
};

const fromWindowHandler = (windowHandler: WindowHandler) => {
  return windowManager.getWindow({ withId: windowHandler.id });
};

export const setTitle = async (title: string) => {
  const window = useCurrentWindow();
  window.setTitle(title);
};

export const setDimensions = async ({
  width,
  height,
  x,
  y,
  origin = 'center',
}: {
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  x?: number | `${number}%`;
  y?: number | `${number}%`;
  origin?:
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'center-left'
    | 'center-right';
} = {}) => {
  const window = useCurrentWindow();
  const display = screen.getDisplayMatching(window.getBounds());

  // Set size first if provided
  if (width !== undefined || height !== undefined) {
    const actualWidth =
      width === undefined
        ? window.getSize()[0]
        : typeof width === 'string'
          ? (display.workAreaSize.width * parseFloat(width.replace('%', ''))) /
            100
          : width;

    const actualHeight =
      height === undefined
        ? window.getSize()[1]
        : typeof height === 'string'
          ? (display.workAreaSize.height *
              parseFloat(height.replace('%', ''))) /
            100
          : height;

    window.setSize(Math.round(actualWidth), Math.round(actualHeight));
  }

  // Then set position if provided
  if (x !== undefined || y !== undefined) {
    const [originY = 'center', originX = 'center'] = origin.split('-');

    const point = {
      x:
        x === undefined
          ? window.getPosition()[0]
          : typeof x === 'string'
            ? (display.workAreaSize.width * parseFloat(x.replace('%', ''))) /
              100
            : x,
      y:
        y === undefined
          ? window.getPosition()[1]
          : typeof y === 'string'
            ? (display.workAreaSize.height * parseFloat(y.replace('%', ''))) /
              100
            : y,
    };

    const windowSize = window.getSize();
    const offset = {
      x:
        originX === 'left'
          ? 0
          : originX === 'right'
            ? -windowSize[0]
            : -windowSize[0] / 2,
      y:
        originY === 'top'
          ? 0
          : originY === 'bottom'
            ? -windowSize[1]
            : -windowSize[1] / 2,
    };

    window.setPosition(
      Math.round(point.x + offset.x),
      Math.round(point.y + offset.y),
    );
  }
};

export const setWindowControlsVisibility = async (visible: boolean) => {
  const window = useCurrentWindow();
  window.setWindowButtonVisibility(visible);
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
  window.setFullScreenable(maximizable);
};

export const setMenuBarVisibility = async (visible: boolean) => {
  const window = useCurrentWindow();
  window.setMenuBarVisibility(visible);
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

export const close = async (opts: {
  window?: WindowHandler;
  windowAtChannel?: string;
}) => {
  if (!opts.window && !opts.windowAtChannel) {
    const currentWindow = useCurrentWindow();
    windowManager.closeWindow({ withId: currentWindow.id });
    return;
  }

  windowManager.closeWindow({
    withId: opts.window?.id,
    atChannel: opts.windowAtChannel,
  });
};

export const createNewWindow = async (
  windowPath: string,
  opts: {
    channel?: string;
  } = {},
): Promise<WindowHandler> => {
  return windowManager.openWindow(windowPath, { channel: opts.channel });
};

export type { WindowHandler };

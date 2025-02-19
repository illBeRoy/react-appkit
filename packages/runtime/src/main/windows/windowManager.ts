import path from 'node:path';
import { app, BrowserWindow } from 'electron';

export type WindowManager = ReturnType<typeof createWindowManager>;

export interface WindowHandler {
  id: number;
}

export class NoWindowError extends Error {
  name = 'NoWindowError';
  constructor({ windowId, channel }: { windowId?: number; channel?: string }) {
    super(
      `No window found${windowId ? ` with id ${windowId}` : ''}${channel ? ` at channel ${channel}` : ''}`,
    );
  }
}

const createWindowManager = () => {
  const channelToWindowId = new Map<string, number>();
  const windowIdToChannel = new Map<number, string | undefined>();
  let windowFrameType: 'native' | 'custom' = 'native';
  let rendererDevServerUrl: string | undefined;

  const openWindow = (
    windowPath: string,
    { channel }: { channel?: string } = {},
  ): WindowHandler => {
    let window: BrowserWindow;

    // try to get existing window if channel is provided and window is already open
    if (channel && channelToWindowId.has(channel)) {
      const windowId = channelToWindowId.get(channel)!;
      window = BrowserWindow.fromId(windowId)!;
      window.hide();
    } else {
      // create a new window
      window = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        center: true,
        titleBarStyle: windowFrameType === 'native' ? 'default' : 'hidden',
        webPreferences: {
          preload: path.join(app.getAppPath(), 'dist/preload/index.js'),
          sandbox: false,
        },
      });

      // ensure to remove the window from channel mapping when window is closed
      window.on('closed', () => {
        const channel = windowIdToChannel.get(window.id);

        if (channel) {
          channelToWindowId.delete(channel);
        }

        windowIdToChannel.delete(window.id);
      });
    }

    const thisIsTheFirstWindow = BrowserWindow.getAllWindows().length === 1;
    if (!channel && thisIsTheFirstWindow) {
      channel = '_top';
    }

    if (channel) {
      // set the channel mapping for the new window
      channelToWindowId.set(channel, window.id);
      windowIdToChannel.set(window.id, channel);
    }

    if (rendererDevServerUrl) {
      const url = new URL(rendererDevServerUrl);
      url.pathname = '/';
      url.hash = windowPath;

      window.loadURL(url.toString()).catch(() => {
        console.error(
          '\nIt seems like the dev server is not running. Either run the "dev" command again, or build a production version using the "build" command before running again',
        );
        process.exit(1);
      });
    } else {
      window.loadFile('dist/renderer/index.html', { hash: windowPath });
    }

    if (process.env.DEBUG_RENDERER === 'true') {
      window.show();
      window.webContents.openDevTools();
    }

    return { id: window.id };
  };

  const getWindow = ({
    withId,
    atChannel,
  }: {
    withId?: number;
    atChannel?: string;
  }) => {
    const windowId = withId ?? channelToWindowId.get(`${atChannel}`);
    if (windowId === undefined) {
      throw new NoWindowError({ windowId, channel: atChannel });
    }

    const window = BrowserWindow.fromId(windowId);
    if (!window) {
      throw new NoWindowError({ windowId, channel: atChannel });
    }

    return window;
  };

  const closeWindow = ({
    withId,
    atChannel,
  }: {
    withId?: number;
    atChannel?: string;
  }) => {
    const window = getWindow({ withId, atChannel });
    window.close();
  };

  const withDevServerUrl = (url: string) => {
    rendererDevServerUrl = url;
  };

  const withWindowFrameType = (type: 'native' | 'custom') => {
    windowFrameType = type;
  };

  return {
    openWindow,
    getWindow,
    closeWindow,
    withDevServerUrl,
    withWindowFrameType,
  };
};

export const windowManager = createWindowManager();

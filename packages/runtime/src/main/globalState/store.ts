import { BrowserWindow } from 'electron';

// @ts-expect-error global.__reactAppkitGlobalStore this is the only place where this value is defined and going to be used
global.__reactAppkitGlobalStore ??= {};

export const globalStore = (): Record<string, unknown> => {
  // @ts-expect-error global.__reactAppkitGlobalStore this is the only place where this value is defined and going to be used
  return global.__reactAppkitGlobalStore;
};

export const getGlobalState = <T>(key: string): T | undefined => {
  return globalStore()[key] as T | undefined;
};

export const setGlobalState = (key: string, value: unknown) => {
  globalStore()[key] = value;
  BrowserWindow.getAllWindows().forEach((window) =>
    window.webContents.send('globalStateChange', key, value),
  );
};

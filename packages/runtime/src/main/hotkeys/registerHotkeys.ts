import { globalShortcut } from 'electron';

export const registerHotkey = (
  shortcut: string,
  callback: () => void | Promise<void>,
) => {
  globalShortcut.register(shortcut, callback);
};

export const registerHotkeys = (
  hotkeys: Map<string, () => void | Promise<void>>,
) => {
  hotkeys.forEach((callback, shortcut) => {
    registerHotkey(shortcut, callback);
  });
};

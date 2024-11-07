import { globalShortcut } from 'electron';

export const registerHotkeys = (
  hotkeys: Map<string, () => void | Promise<void>>,
) => {
  hotkeys.forEach((callback, shortcut) => {
    globalShortcut.register(shortcut, callback);
  });
};

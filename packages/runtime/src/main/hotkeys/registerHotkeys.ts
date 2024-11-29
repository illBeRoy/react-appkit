import { globalShortcut } from 'electron';

const builtinHotkeys: Map<string, () => void | Promise<void>> =
  process.platform === 'darwin'
    ? new Map([
        [
          'CmdOrCtrl+Q',
          () => {
            app.quit();
          },
        ],
      ])
    : new Map();

export const setHotkeys = (
  hotkeys: Map<string, () => void | Promise<void>>,
) => {
  globalShortcut.unregisterAll();

  builtinHotkeys.forEach((callback, shortcut) => {
    globalShortcut.register(shortcut, callback);
  });

  hotkeys.forEach((callback, shortcut) => {
    globalShortcut.register(shortcut, callback);
  });
};

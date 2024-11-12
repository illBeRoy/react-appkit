import { BrowserWindow, dialog } from 'electron';
import { useSender } from '../actionsEngine/context';

const useWindowIfExists = () => {
  try {
    const sender = useSender();
    return BrowserWindow.fromWebContents(sender);
  } catch (e) {
    return null;
  }
};

export interface FileDialogOptions {
  title?: string;
  path?: string;
  button?: string;
  ext?: string[];
  attachToWindow?: boolean;
}

export interface OpenDialogOptions extends FileDialogOptions {
  mode?: 'directory' | 'file' | 'multiple files';
}

export type OpenDialogResults =
  | { result: 'ok'; paths: string[] }
  | { result: 'canceled' };

export async function showOpenDialog(
  opts: OpenDialogOptions = {},
): Promise<OpenDialogResults> {
  const window = useWindowIfExists();

  const dialogOpts: Electron.OpenDialogOptions = {
    title: opts.title,
    defaultPath: opts.path,
    buttonLabel: opts.button,
    filters: opts.ext
      ? [
          {
            name: '*',
            extensions: opts.ext,
          },
        ]
      : undefined,
    properties: [
      opts.mode === 'directory' ? 'openDirectory' : 'openFile',
      ...(opts.mode === 'multiple files' ? ['multiSelections' as const] : []),
    ],
  };

  const results = await (window && opts.attachToWindow !== false
    ? dialog.showOpenDialog(window, dialogOpts)
    : dialog.showOpenDialog(dialogOpts));

  if (!results.canceled) {
    return { result: 'ok', paths: results.filePaths };
  } else {
    return { result: 'canceled' };
  }
}

export interface SaveDialogOptions extends FileDialogOptions {}

export type SaveDialogResults =
  | { result: 'ok'; path: string }
  | { result: 'canceled' };

export async function showSaveDialog(
  opts: SaveDialogOptions = {},
): Promise<SaveDialogResults> {
  const window = useWindowIfExists();

  const dialogOpts: Electron.SaveDialogOptions = {
    title: opts.title,
    defaultPath: opts.path,
    buttonLabel: opts.button,
    filters: opts.ext
      ? [
          {
            name: '*',
            extensions: opts.ext,
          },
        ]
      : undefined,
  };

  const results = await (window && opts.attachToWindow !== false
    ? dialog.showSaveDialog(window, dialogOpts)
    : dialog.showSaveDialog(dialogOpts));

  if (!results.canceled) {
    return { result: 'ok', path: results.filePath };
  } else {
    return { result: 'canceled' };
  }
}

export interface AlertOptions {
  title?: string;
  buttons?: string[];
  skin?: 'default' | 'info' | 'warning' | 'error' | 'question';
  attachToWindow?: boolean;
}

export interface AlertResults {
  result: 'cancel' | 'confirm' | (string & {});
}

export async function alert(
  message: unknown,
  opts: AlertOptions = {},
): Promise<AlertResults> {
  const window = useWindowIfExists();

  const results = await (window && opts.attachToWindow !== false
    ? dialog.showMessageBox(window, {
        message: `${message}`,
        title: opts.title,
        buttons: opts.buttons,
        type:
          opts.skin === 'error'
            ? 'error'
            : opts.skin === 'question'
              ? 'question'
              : opts.skin === 'warning'
                ? 'warning'
                : opts.skin === 'info'
                  ? 'info'
                  : 'none',
      })
    : dialog.showMessageBox({ message: `${message}` }));

  return {
    result:
      results.response === 0
        ? 'cancel'
        : (opts.buttons?.[results.response - 1] ?? 'confirm'),
  };
}

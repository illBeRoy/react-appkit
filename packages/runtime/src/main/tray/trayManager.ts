import { Menu, Tray } from 'electron';
import { emptyIcon, trayIcon } from './icon';

export class TrayNotInitializedError extends Error {
  name = 'TrayNotInitializedError';
  message =
    'You probably tried to use tray and menu components outside of a <Tray /> parent.';
}

export type TrayManager = ReturnType<typeof createTrayManager>;

export const createTrayManager = () => {
  let tray: Tray | null = null;

  const create = () => {
    tray = new Tray(emptyIcon);
  };

  const destroy = () => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    tray.destroy();
    tray = null;
  };

  const setIcon = async (imageDataUri: string) => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    const icon = await trayIcon(imageDataUri);
    tray.setImage(icon);
  };

  const setContextMenu = (menu: Menu | null) => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    tray.setContextMenu(menu);
  };

  return { create, destroy, setIcon, setContextMenu };
};

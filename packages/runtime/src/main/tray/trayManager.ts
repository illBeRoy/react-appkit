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
  let contextMenu: Menu | null = null;

  const create = () => {
    tray = new Tray(emptyIcon);
  };

  const destroy = () => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    tray.destroy();
    tray = null;
    contextMenu = null;
  };

  const setIcon = async (imageDataUri: string) => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    const icon = await trayIcon(imageDataUri);
    tray.setImage(icon);
  };

  const setTooltip = (tooltip: string) => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    tray.setToolTip(tooltip);
  };

  const setContextMenu = (menu: Menu | null) => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    tray.setContextMenu(menu);
    contextMenu = menu;
  };

  const redrawContextMenu = () => {
    if (!tray) {
      throw new TrayNotInitializedError();
    }

    console.log('redrawing context menu');

    tray.setContextMenu(new Menu());
    tray.setContextMenu(contextMenu);
  };

  return {
    create,
    destroy,
    setIcon,
    setTooltip,
    setContextMenu,
    redrawContextMenu,
  };
};

import { Menu, Tray } from 'electron';
import { emptyIcon, trayIcon } from './icon';

export type TrayManager = ReturnType<typeof createTrayManager>;

export const createTrayManager = () => {
  let tray: Tray | null = null;

  const create = () => {
    tray = new Tray(emptyIcon);
  };

  const destroy = () => {
    if (!tray) {
      return;
    }

    tray.destroy();
    tray = null;
  };

  const setIcon = async (imageDataUri: string) => {
    if (!tray) {
      return;
    }

    const icon = await trayIcon(imageDataUri);
    tray.setImage(icon);
  };

  const setTooltip = (tooltip: string) => {
    if (!tray) {
      return;
    }

    tray.setToolTip(tooltip);
  };

  const setContextMenu = (menu: Menu | null) => {
    if (!tray) {
      return;
    }

    tray.setContextMenu(menu);
  };

  return {
    create,
    destroy,
    setIcon,
    setTooltip,
    setContextMenu,
  };
};

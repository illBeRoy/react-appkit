import { app, Menu, MenuItem } from 'electron';

const defaultMacAppMenu = new MenuItem({
  label: 'Application',
  submenu: [
    { label: 'About', click: () => app.showAboutPanel() },
    { type: 'separator' },
    {
      label: 'Quit',
      accelerator: 'CmdOrCtrl+Q',
      click: () => app.quit(),
    },
  ],
});

export type MenuManager = ReturnType<typeof createMenuManager>;

const createMenuManager = () => {
  let menu = new Menu();

  const setMenu = (newMenu: Menu | null) => {
    const rebuiltMenu = new Menu();

    if (process.platform === 'darwin') {
      const macAppMenu = newMenu?.items?.find((item) =>
        item.label.startsWith('#MAC_APP_MENU::'),
      );

      if (macAppMenu) {
        macAppMenu.label = macAppMenu.label.replace('#MAC_APP_MENU::', '');
      }

      rebuiltMenu.append(macAppMenu ?? defaultMacAppMenu);
    }

    newMenu?.items.forEach((item) => rebuiltMenu.append(item));

    menu = rebuiltMenu;
    Menu.setApplicationMenu(menu);
  };

  return {
    setMenu,
  };
};

export const menuManager = createMenuManager();

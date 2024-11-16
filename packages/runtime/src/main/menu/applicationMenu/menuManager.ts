import { app, Menu, MenuItem } from 'electron';

const defaultMacAppMenu = () =>
  new MenuItem({
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

export class OnlyOneMacAppMenuAllowedError extends Error {
  name = 'OnlyOneMacAppMenuAllowedError';
  message =
    'There can only be one <Menu isMacAppMenu /> component, found multiple';
}

export class OnlyMenusAllowedInRootError extends Error {
  name = 'OnlyMenusAllowedInRootError';
  message =
    'Only <Menu /> components are allowed as top level components inside <ApplicationMenu />';
}

export type MenuManager = ReturnType<typeof createMenuManager>;

export const createMenuManager = () => {
  const setMenu = (userRootMenu: Menu | null) => {
    const rootMenu = new Menu();

    if (process.platform === 'darwin') {
      const menusMarkedAsMacAppMenu =
        userRootMenu?.items?.filter((item) =>
          item.label.startsWith('#MAC_APP_MENU::'),
        ) ?? [];

      if (menusMarkedAsMacAppMenu.length > 1) {
        throw new OnlyOneMacAppMenuAllowedError();
      }

      const [maybeMacAppMenu] = menusMarkedAsMacAppMenu;

      if (maybeMacAppMenu && maybeMacAppMenu.type !== 'submenu') {
        throw new OnlyMenusAllowedInRootError();
      }

      if (maybeMacAppMenu) {
        rootMenu.append(
          new MenuItem({
            id: maybeMacAppMenu.id,
            label: maybeMacAppMenu.label.replace('#MAC_APP_MENU::', ''),
            type: 'submenu',
            submenu: maybeMacAppMenu.submenu,
          }),
        );
      } else {
        rootMenu.append(defaultMacAppMenu());
      }
    }

    userRootMenu?.items.forEach((item) => {
      if (item.type !== 'submenu') {
        throw new OnlyMenusAllowedInRootError();
      }

      if (rootMenu.items.every((itm) => itm.id !== item.id)) {
        rootMenu.append(item);
      }
    });

    console.log(rootMenu.items.map((item) => item.label));

    Menu.setApplicationMenu(rootMenu);
  };

  return {
    setMenu,
  };
};

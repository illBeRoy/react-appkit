import { app, Menu, MenuItem } from 'electron';

export const defaultMenu = new Menu();

export const defaultMacMenu = new Menu();
defaultMacMenu.append(
  new MenuItem({
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit(),
      },
    ],
  }),
);

import { createContext, useContext, useEffect, useRef } from 'react';
import { Menu as ElectronMenu, MenuItem as ElectronMenuItem } from 'electron';

export interface MenuProps {
  children: React.ReactNode;
  label?: string;
  enabled?: boolean;
}

interface MenuContext {
  getMenuItemId: () => string;
  upsertItem: (item: ElectronMenuItem) => void;
}

const MenuContext = createContext<MenuContext | null>(null);

export interface RootMenuProviderProps {
  children: React.ReactNode;
  onRootMenuChange: (menu: ElectronMenu | null) => void;
}

export const RootMenuProvider = ({
  children,
  onRootMenuChange,
}: RootMenuProviderProps) => {
  const rootMenu = useRef(new ElectronMenu());
  const updateWasScheduled = useRef(false);

  const updateRootMenuFromChildMenuComponent = (item: ElectronMenuItem) => {
    if (item.type !== 'submenu' || !item.submenu) {
      throw new MenuItemOutsideOfMenuError();
    }

    rootMenu.current = item.submenu;

    if (!updateWasScheduled.current) {
      updateWasScheduled.current = true;

      setImmediate(() => {
        onRootMenuChange(rootMenu.current);
        updateWasScheduled.current = false;
      });
    }
  };

  return (
    <MenuContext.Provider
      value={{
        getMenuItemId: () => 'root',
        upsertItem: updateRootMenuFromChildMenuComponent,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

const useParentMenu = (): MenuContext => {
  const context = useContext(MenuContext);

  if (!context) {
    throw new MenuContextError();
  }

  return context;
};

export const Menu = ({ children, label = '', enabled = true }: MenuProps) => {
  const parentMenu = useParentMenu();
  const id = parentMenu.getMenuItemId();

  parentMenu.upsertItem(
    new ElectronMenuItem({
      id,
      type: 'submenu',
      label,
      enabled,
      submenu: new ElectronMenu(),
    }),
  );

  const submenu = useRef(new ElectronMenu());
  const nextIdForMenuItem = useRef(0);

  submenu.current = new ElectronMenu();
  nextIdForMenuItem.current = 0;

  const getMenuItemIdForChildrenOfThisMenu = () => {
    const id = nextIdForMenuItem.current;
    nextIdForMenuItem.current++;
    return `${id}`;
  };

  const upsertItemIntoThisMenu = (item: ElectronMenuItem) => {
    const items = [
      ...submenu.current.items.filter((i) => i.id !== item.id),
      item,
    ];

    items.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    submenu.current = new ElectronMenu();

    items.forEach((item) => {
      submenu.current.append(item);
    });

    parentMenu.upsertItem(
      new ElectronMenuItem({
        id,
        type: 'submenu',
        label,
        enabled,
        submenu: submenu.current,
      }),
    );
  };

  return (
    <MenuContext.Provider
      value={{
        getMenuItemId: getMenuItemIdForChildrenOfThisMenu,
        upsertItem: upsertItemIntoThisMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export interface MenuButtonItemProps {
  label: string;
  enabled?: boolean;
  onClick?: () => void;
}

const MenuButtonItem = ({
  label,
  enabled = true,
  onClick = () => {},
}: MenuButtonItemProps) => {
  const parentMenu = useParentMenu();
  const id = parentMenu.getMenuItemId();

  parentMenu.upsertItem(
    new ElectronMenuItem({
      id,
      type: 'normal',
      label,
      enabled,
      click: onClick,
    }),
  );

  return null;
};

export interface MenuCheckboxItemProps {
  label: string;
  enabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
}

const MenuCheckboxItem = ({
  label,
  enabled = true,
  checked = false,
  onClick = () => {},
}: MenuCheckboxItemProps) => {
  const parentMenu = useParentMenu();
  const id = parentMenu.getMenuItemId();

  parentMenu.upsertItem(
    new ElectronMenuItem({
      id,
      type: 'checkbox',
      label,
      enabled,
      click: onClick,
      checked,
    }),
  );

  return null;
};

export interface MenuRadioItemProps {
  label: string;
  enabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
}

const MenuRadioItem = ({
  label,
  enabled = true,
  checked = false,
  onClick = () => {},
}: MenuRadioItemProps) => {
  const parentMenu = useParentMenu();
  const id = parentMenu.getMenuItemId();

  parentMenu.upsertItem(
    new ElectronMenuItem({
      id,
      type: 'radio',
      label,
      enabled,
      click: onClick,
      checked,
    }),
  );

  return null;
};

const MenuSeparatorItem = () => {
  const parentMenu = useParentMenu();
  const id = parentMenu.getMenuItemId();

  parentMenu.upsertItem(new ElectronMenuItem({ id, type: 'separator' }));

  return null;
};

export class MenuContextError extends Error {
  name = 'MenuContextError';
  message =
    'Menu components can only be used inside of a relevant context, like the tray or the app menu.';
}

export class MenuItemOutsideOfMenuError extends Error {
  name = 'MenuItemOutsideOfMenuError';
  message = 'Menu items can only be used inside of a <Menu /> component.';
}

export const MenuItem = {
  Button: MenuButtonItem,
  Checkbox: MenuCheckboxItem,
  Radio: MenuRadioItem,
  Separator: MenuSeparatorItem,
};

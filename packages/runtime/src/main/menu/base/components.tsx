import { createContext, useContext, useEffect, useRef } from 'react';
import { Menu as ElectronMenu, MenuItem as ElectronMenuItem } from 'electron';
import { useFirstRender, useUnmount } from '../../nodeRenderer/hooks';

export interface MenuProps {
  children: React.ReactNode;
  label?: string;
  enabled?: boolean;
}

interface MenuContext {
  append: (item: ElectronMenuItem) => void;
  remove: (id: string) => void;
  modify: (id: string, item: ElectronMenuItem) => void;
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
  const setRootMenuFromMenuItem = (item: ElectronMenuItem) => {
    if (item.type !== 'submenu' || !item.submenu) {
      throw new MenuItemOutsideOfMenuError();
    }

    onRootMenuChange(item.submenu);
  };

  const append = (item: ElectronMenuItem) => {
    setRootMenuFromMenuItem(item);
  };

  const remove = () => {
    onRootMenuChange(null);
  };

  const modify = (_id: string, item: ElectronMenuItem) => {
    setRootMenuFromMenuItem(item);
  };

  return (
    <MenuContext.Provider value={{ append, remove, modify }}>
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
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentMenu();
  const menu = useRef(new ElectronMenu());

  useFirstRender(() => {
    parentMenu.append(
      new ElectronMenuItem({
        id: id.current,
        type: 'submenu',
        label,
        enabled,
        submenu: menu.current,
      }),
    );
  });

  useEffect(() => {
    parentMenu.modify(
      id.current,
      new ElectronMenuItem({
        id: id.current,
        type: 'submenu',
        label,
        enabled,
        submenu: menu.current,
      }),
    );
  }, [label, enabled]);

  useUnmount(() => {
    parentMenu.remove(id.current);
  });

  const append = (item: ElectronMenuItem) => {
    menu.current.append(item);
  };

  const remove = (itemId: string) => {
    const newMenu = new ElectronMenu();

    menu.current.items.forEach((item) => {
      if (item.id !== itemId) {
        newMenu.append(item);
      }
    });

    menu.current = newMenu;

    parentMenu.modify(
      id.current,
      new ElectronMenuItem({
        id: id.current,
        type: 'submenu',
        label,
        enabled,
        submenu: newMenu,
      }),
    );
  };

  const modify = (itemId: string, modifiedItem: ElectronMenuItem) => {
    const newMenu = new ElectronMenu();

    menu.current.items.forEach((item) => {
      if (item.id === itemId) {
        newMenu.append(modifiedItem);
      } else {
        newMenu.append(item);
      }
    });

    menu.current = newMenu;

    parentMenu.modify(
      id.current,
      new ElectronMenuItem({
        id: id.current,
        type: 'submenu',
        label,
        enabled,
        submenu: newMenu,
      }),
    );
  };

  return (
    <MenuContext.Provider value={{ append, remove, modify }}>
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
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentMenu();

  useFirstRender(() => {
    parentMenu.append(
      new ElectronMenuItem({
        id: id.current,
        type: 'normal',
        label,
        enabled,
        click: onClick,
      }),
    );
  });

  useEffect(() => {
    parentMenu.modify(
      id.current,
      new ElectronMenuItem({
        id: id.current,
        type: 'normal',
        label,
        enabled,
        click: onClick,
      }),
    );
  }, [label, enabled, onClick]);

  useUnmount(() => {
    parentMenu.remove(id.current);
  });

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
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentMenu();

  useFirstRender(() => {
    parentMenu.append(
      new ElectronMenuItem({
        id: id.current,
        type: 'checkbox',
        label,
        enabled,
        click: onClick,
        checked,
      }),
    );
  });

  useEffect(() => {
    parentMenu.modify(
      id.current,
      new ElectronMenuItem({
        id: id.current,
        type: 'checkbox',
        label,
        enabled,
        click: onClick,
        checked,
      }),
    );
  }, [label, enabled, onClick]);

  useUnmount(() => {
    parentMenu.remove(id.current);
  });

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
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentMenu();

  useFirstRender(() => {
    parentMenu.append(
      new ElectronMenuItem({
        id: id.current,
        type: 'radio',
        label,
        enabled,
        click: onClick,
        checked,
      }),
    );
  });

  useEffect(() => {
    parentMenu.modify(
      id.current,
      new ElectronMenuItem({
        id: id.current,
        type: 'radio',
        label,
        enabled,
        click: onClick,
        checked,
      }),
    );
  }, [label, enabled, onClick]);

  useUnmount(() => {
    parentMenu.remove(id.current);
  });

  return null;
};

const MenuSeparatorItem = () => {
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentMenu();

  useFirstRender(() => {
    parentMenu.append(
      new ElectronMenuItem({ id: id.current, type: 'separator' }),
    );
  });

  useUnmount(() => {
    parentMenu.remove(id.current);
  });

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

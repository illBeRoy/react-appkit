import { createContext, useContext, useEffect, useRef } from 'react';
import type { TrayManager } from './trayManager';
import { Menu, MenuItem } from 'electron';
import { useFirstRender, useUnmount } from './renderer';

export interface TrayProviderProps {
  manager: TrayManager;
  children: React.ReactNode;
}

const TrayContext = createContext<TrayManager | null>(null);

export const TrayProvider = ({ manager, children }: TrayProviderProps) => {
  return (
    <TrayContext.Provider value={manager}>{children}</TrayContext.Provider>
  );
};

export class TrayManagerContextError extends Error {
  name = 'TrayManagerContextError';
  message =
    'Cannot mount Tray components outside of the "./src/tray.tsx" file.';
}

export class TrayMenuContextError extends Error {
  name = 'TrayMenuContextError';
  message =
    'All <TrayMenuItem /> components can only be used inside of a <TrayMenu /> component.';
}

const useTrayManager = () => {
  const context = useContext(TrayContext);

  if (!context) {
    throw new TrayManagerContextError();
  }

  return context;
};

export interface TrayProps {
  icon: string;
  children: React.ReactNode;
}

export const Tray = ({ icon, children }: TrayProps) => {
  const manager = useTrayManager();

  useFirstRender(() => {
    manager.create();
  });

  useUnmount(() => {
    manager.destroy();
  });

  useEffect(() => {
    manager.setIcon(icon);
  }, [icon]);

  return children;
};

export interface TrayMenuProps {
  children: React.ReactNode;
  label?: string;
  enabled?: boolean;
}

interface MenuContext {
  append: (item: MenuItem) => void;
  remove: (id: string) => void;
  modify: (id: string, item: MenuItem) => void;
}

const TrayMenuContext = createContext<MenuContext | null>(null);

const useParentTrayMenu = <TRequired extends boolean = true>({
  required = true as TRequired,
}: { required?: TRequired } = {}): TRequired extends true
  ? MenuContext
  : MenuContext | null => {
  const context = useContext(TrayMenuContext);

  if (required && !context) {
    throw new TrayMenuContextError();
  }

  return context as MenuContext;
};

export const TrayMenu = ({
  children,
  label = '',
  enabled = true,
}: TrayMenuProps) => {
  const id = useRef(crypto.randomUUID());
  const trayManager = useTrayManager();
  const parentMenu = useParentTrayMenu({ required: false });
  const menu = useRef(new Menu());

  useFirstRender(() => {
    if (parentMenu) {
      parentMenu.append(
        new MenuItem({
          id: id.current,
          type: 'submenu',
          label,
          enabled,
          submenu: menu.current,
        }),
      );
    } else {
      trayManager.setContextMenu(menu.current);
    }
  });

  useEffect(() => {
    if (parentMenu) {
      parentMenu.modify(
        id.current,
        new MenuItem({
          id: id.current,
          type: 'submenu',
          label,
          enabled,
          submenu: menu.current,
        }),
      );
    }
  }, [label, enabled]);

  useUnmount(() => {
    if (parentMenu) {
      parentMenu.remove(id.current);
    } else {
      trayManager.setContextMenu(null);
    }
  });

  const append = (item: MenuItem) => {
    menu.current.append(item);
  };

  const remove = (itemId: string) => {
    const newMenu = new Menu();

    menu.current.items.forEach((item) => {
      if (item.id !== itemId) {
        newMenu.append(item);
      }
    });

    menu.current = newMenu;

    if (parentMenu) {
      parentMenu.modify(
        id.current,
        new MenuItem({
          id: id.current,
          type: 'submenu',
          label,
          enabled,
          submenu: newMenu,
        }),
      );
    } else {
      trayManager.setContextMenu(newMenu);
    }
  };

  const modify = (itemId: string, modifiedItem: MenuItem) => {
    const newMenu = new Menu();

    menu.current.items.forEach((item) => {
      if (item.id === itemId) {
        newMenu.append(modifiedItem);
      } else {
        newMenu.append(item);
      }
    });

    menu.current = newMenu;

    if (parentMenu) {
      parentMenu.modify(
        id.current,
        new MenuItem({
          id: id.current,
          type: 'submenu',
          label,
          enabled,
          submenu: newMenu,
        }),
      );
    } else {
      trayManager.setContextMenu(newMenu);
    }
  };

  return (
    <TrayMenuContext.Provider value={{ append, remove, modify }}>
      {children}
    </TrayMenuContext.Provider>
  );
};

export interface TrayMenuButtonItemProps {
  label: string;
  enabled?: boolean;
  onClick?: () => void;
}

const TrayMenuButtonItem = ({
  label,
  enabled = true,
  onClick = () => {},
}: TrayMenuButtonItemProps) => {
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentTrayMenu();

  useFirstRender(() => {
    parentMenu.append(
      new MenuItem({
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
      new MenuItem({
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

export interface TrayMenuCheckboxItemProps {
  label: string;
  enabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
}

const TrayMenuCheckboxItem = ({
  label,
  enabled = true,
  checked = false,
  onClick = () => {},
}: TrayMenuCheckboxItemProps) => {
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentTrayMenu();

  useFirstRender(() => {
    parentMenu.append(
      new MenuItem({
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
      new MenuItem({
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

export interface TrayMenuRadioItemProps {
  label: string;
  enabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
}

const TrayMenuRadioItem = ({
  label,
  enabled = true,
  checked = false,
  onClick = () => {},
}: TrayMenuRadioItemProps) => {
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentTrayMenu();

  useFirstRender(() => {
    parentMenu.append(
      new MenuItem({
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
      new MenuItem({
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

const TrayMenuSeparatorItem = () => {
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentTrayMenu();

  useFirstRender(() => {
    parentMenu.append(new MenuItem({ id: id.current, type: 'separator' }));
  });

  useUnmount(() => {
    parentMenu.remove(id.current);
  });

  return null;
};

export const TrayMenuItem = {
  Button: TrayMenuButtonItem,
  Checkbox: TrayMenuCheckboxItem,
  Radio: TrayMenuRadioItem,
  Separator: TrayMenuSeparatorItem,
};

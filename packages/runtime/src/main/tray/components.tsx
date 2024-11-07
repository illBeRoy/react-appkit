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

const TrayMenuContext = createContext<Menu | null>(null);

const useParentTrayMenu = <TRequired extends boolean = true>({
  required = true as TRequired,
}: { required?: TRequired } = {}): TRequired extends true
  ? Menu
  : Menu | null => {
  const context = useContext(TrayMenuContext);

  if (required && !context) {
    throw new TrayMenuContextError();
  }

  return context as Menu;
};

const useMenuMutation = () => {
  const manager = useTrayManager();

  const mutateMenu = (menuMutatorFn: () => void) => {
    menuMutatorFn();
    manager.redrawContextMenu();
  };

  return { mutateMenu };
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
  const { mutateMenu } = useMenuMutation();

  useFirstRender(() => {
    mutateMenu(() => {
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
  });

  useUnmount(() => {
    mutateMenu(() => {
      if (parentMenu) {
        const indexOfItem = parentMenu.items.findIndex(
          (item) => item.id === id.current,
        );

        parentMenu.items.splice(indexOfItem, 1);
      } else {
        trayManager.setContextMenu(null);
      }
    });
  });

  return (
    <TrayMenuContext.Provider value={menu.current}>
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
  const { mutateMenu } = useMenuMutation();

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
    console.log(label);
    mutateMenu(() => {
      const existingItem = parentMenu.items.find(
        (item) => item.id === id.current,
      );

      if (existingItem) {
        existingItem.label = label;
        existingItem.enabled = enabled;
        existingItem.click = onClick;
      }
    });
  }, [label, enabled, onClick]);

  useUnmount(() => {
    mutateMenu(() => {
      const indexOfItem = parentMenu.items.findIndex(
        (item) => item.id === id.current,
      );

      if (indexOfItem !== -1) {
        parentMenu.items.splice(indexOfItem, 1);
      }
    });
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
  const { mutateMenu } = useMenuMutation();

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
    mutateMenu(() => {
      const existingItem = parentMenu.items.find(
        (item) => item.id === id.current,
      );
      if (existingItem) {
        existingItem.label = label;
        existingItem.enabled = enabled;
        existingItem.click = onClick;
        existingItem.checked = checked;
      }
    });
  }, [label, enabled, onClick]);

  useUnmount(() => {
    mutateMenu(() => {
      const indexOfItem = parentMenu.items.findIndex(
        (item) => item.id === id.current,
      );

      if (indexOfItem !== -1) {
        parentMenu.items.splice(indexOfItem, 1);
      }
    });
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
  const { mutateMenu } = useMenuMutation();

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
    mutateMenu(() => {
      const existingItem = parentMenu.items.find(
        (item) => item.id === id.current,
      );
      if (existingItem) {
        existingItem.label = label;
        existingItem.enabled = enabled;
        existingItem.click = onClick;
        existingItem.checked = checked;
      }
    });
  }, [label, enabled, onClick]);

  useUnmount(() => {
    mutateMenu(() => {
      const indexOfItem = parentMenu.items.findIndex(
        (item) => item.id === id.current,
      );

      if (indexOfItem !== -1) {
        parentMenu.items.splice(indexOfItem, 1);
      }
    });
  });

  return null;
};

const TrayMenuSeparatorItem = () => {
  const id = useRef(crypto.randomUUID());
  const parentMenu = useParentTrayMenu();
  const { mutateMenu } = useMenuMutation();

  useFirstRender(() => {
    mutateMenu(() => {
      parentMenu.append(new MenuItem({ id: id.current, type: 'separator' }));
    });
  });

  useUnmount(() => {
    mutateMenu(() => {
      const indexOfItem = parentMenu.items.findIndex(
        (item) => item.id === id.current,
      );

      parentMenu.items.splice(indexOfItem, 1);
    });
  });

  return null;
};

export const TrayMenuItem = {
  Button: TrayMenuButtonItem,
  Checkbox: TrayMenuCheckboxItem,
  Radio: TrayMenuRadioItem,
  Separator: TrayMenuSeparatorItem,
};

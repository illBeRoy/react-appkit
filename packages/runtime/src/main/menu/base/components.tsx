import {
  Children,
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { Menu as ElectronMenu, MenuItem as ElectronMenuItem } from 'electron';

export const MenuContext = createContext<{
  isInMenu: boolean;
  isInRootMenu: boolean;
  updateRootMenu?: (menu: ElectronMenu | null) => void;
}>({
  isInMenu: false,
  isInRootMenu: false,
});

export const useIsInMenu = () => {
  const context = useContext(MenuContext);

  if (!context.isInMenu) {
    throw new MenuContextError();
  }

  return context.isInMenu;
};

export interface RootMenuProviderProps {
  children: React.ReactNode;
  onRootMenuChange: (menu: ElectronMenu | null) => void;
}

export const RootMenuProvider = ({
  children,
  onRootMenuChange,
}: RootMenuProviderProps) => {
  return (
    <MenuContext.Provider
      value={{
        isInRootMenu: true,
        isInMenu: false,
        updateRootMenu: onRootMenuChange,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export interface MenuProps {
  children: React.ReactNode;
  label?: string;
  enabled?: boolean;
}

export const ToNativeMenuItem = Symbol('ToNativeMenuItem');

export interface MenuItemComponent<TProps> {
  (props: TProps): React.ReactNode;
  [ToNativeMenuItem]: (props: TProps) => ElectronMenuItem;
}

export const Menu: MenuItemComponent<MenuProps> = ({ children }) => {
  const { isInMenu, isInRootMenu, updateRootMenu } = useContext(MenuContext);

  if (!isInRootMenu && !isInMenu) {
    throw new MenuItemOutsideOfMenuError();
  }

  useEffect(() => {
    if (isInRootMenu) {
      const menu = Menu[ToNativeMenuItem]({
        children,
      });

      updateRootMenu!(menu.submenu!);
    }
  }, [isInRootMenu, updateRootMenu, children]);

  return (
    <MenuContext.Provider
      value={{
        isInMenu: true,
        isInRootMenu: false,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

Menu[ToNativeMenuItem] = (props) => {
  console.log('Menu ToNativeMenuItem:', { props });
  const electronMenu = new ElectronMenu();

  const childrenOfMenuContext: ReactNode = // @ts-expect-error :\ well
    Children.toArray(props.children)[0].props.children;

  Children.forEach(childrenOfMenuContext, (child) => {
    if (
      child &&
      typeof child === 'object' &&
      'type' in child &&
      child.type &&
      child.type[ToNativeMenuItem] &&
      typeof child.type[ToNativeMenuItem] === 'function'
    ) {
      // @ts-expect-error I don't feel like fighting with the type checker here. this is a private symbol and it's not going to be used outside of this file.
      electronMenu.append(child.type[ToNativeMenuItem](child.props));
    }
  });

  return new ElectronMenuItem({
    type: 'submenu',
    label: props.label,
    enabled: props.enabled ?? true,
    submenu: electronMenu,
  });
};

export interface MenuButtonItemProps {
  label: string;
  enabled?: boolean;
  onClick?: () => void;
}

const MenuButtonItem: MenuItemComponent<MenuButtonItemProps> = () => {
  useIsInMenu();
  return null;
};

MenuButtonItem[ToNativeMenuItem] = (props) => {
  console.log('MenuButtonItem ToNativeMenuItem:', { props });
  return new ElectronMenuItem({
    type: 'normal',
    label: props.label,
    enabled: props.enabled ?? true,
    click: props.onClick ?? (() => {}),
  });
};

export interface MenuCheckboxItemProps {
  label: string;
  enabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
}

const MenuCheckboxItem: MenuItemComponent<MenuCheckboxItemProps> = () => {
  useIsInMenu();
  return null;
};

MenuCheckboxItem[ToNativeMenuItem] = (props) => {
  console.log('MenuCheckboxItem ToNativeMenuItem:', { props });
  return new ElectronMenuItem({
    type: 'checkbox',
    label: props.label,
    enabled: props.enabled ?? true,
    checked: props.checked ?? false,
    click: props.onClick ?? (() => {}),
  });
};

export interface MenuRadioItemProps {
  label: string;
  enabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
}

const MenuRadioItem: MenuItemComponent<MenuRadioItemProps> = () => {
  useIsInMenu();
  return null;
};

MenuRadioItem[ToNativeMenuItem] = (props) => {
  console.log('MenuRadioItem ToNativeMenuItem:', { props });
  return new ElectronMenuItem({
    type: 'radio',
    label: props.label,
    enabled: props.enabled ?? true,
    checked: props.checked ?? false,
    click: props.onClick ?? (() => {}),
  });
};

const MenuSeparatorItem: MenuItemComponent<Record<string, never>> = () => {
  useIsInMenu();
  return null;
};

MenuSeparatorItem[ToNativeMenuItem] = () => {
  console.log('MenuSeparatorItem ToNativeMenuItem called');
  return new ElectronMenuItem({ type: 'separator' });
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

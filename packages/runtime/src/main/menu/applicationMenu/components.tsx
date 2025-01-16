import { createContext, useContext } from 'react';
import {
  RootMenuProvider,
  Menu as BaseMenu,
  MenuItem as BaseMenuItem,
  type MenuItemComponent,
  ToNativeMenuItem,
} from '../base/components';
import type { MenuManager } from './menuManager';
import { useFirstRender } from '../../nodeRenderer/hooks';

export interface MenuManagerProviderProps {
  manager: MenuManager;
  children: React.ReactNode;
}

const MenuManagerContext = createContext<MenuManager | null>(null);

export const MenuManagerProvider = MenuManagerContext.Provider;

export const useMenuManager = () => {
  const manager = useContext(MenuManagerContext);

  if (!manager) {
    throw new MenuManagerContextError();
  }

  return manager;
};

export class MenuManagerContextError extends Error {
  name = 'MenuManagerContextError';
  message =
    'Cannot use <Menu /> components outside of the "./src/menu.tsx" file';
}

export const EmptyMenu = () => {
  // const manager = useMenuManager();

  // useFirstRender(() => {
  //   manager.setMenu(null);
  // });

  return null;
};

export interface ApplicationMenuProps {
  children: React.ReactNode;
}

export const ApplicationMenu = ({ children }: ApplicationMenuProps) => {
  const manager = useMenuManager();

  return (
    <RootMenuProvider
      onRootMenuChange={(...args) => {
        console.log('called with', args[0]?.items);
        manager.setMenu(...args);
      }}
    >
      <BaseMenu>{children}</BaseMenu>
    </RootMenuProvider>
  );
};

export interface MenuProps {
  children: React.ReactNode;
  title: string;
  isMacAppMenu?: boolean; // If true, the menu item will be used the default Mac app menu (the menu right next to the apple icon)
}

export const Menu: MenuItemComponent<MenuProps> = ({
  children,
  title,
  isMacAppMenu = false,
}) => {
  return (
    <BaseMenu label={`${isMacAppMenu ? '#MAC_APP_MENU::' : ''}${title}`}>
      {children}
    </BaseMenu>
  );
};

Menu[ToNativeMenuItem] = (props) => {
  return BaseMenu[ToNativeMenuItem]({
    children: props.children,
    label: `${props.isMacAppMenu ? '#MAC_APP_MENU::' : ''}${props.title}`,
  });
};

export const MenuItem = {
  ...BaseMenuItem,
  Submenu: BaseMenu,
};

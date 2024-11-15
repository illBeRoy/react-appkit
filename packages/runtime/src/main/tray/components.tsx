import { createContext, useContext, useEffect } from 'react';
import type { TrayManager } from './trayManager';
import { useFirstRender, useUnmount } from '../nodeRenderer/hooks';
import { Menu, MenuItem, RootMenuProvider } from '../menu/base/components';

export interface TrayProviderProps {
  manager: TrayManager;
  children: React.ReactNode;
}

const TrayContext = createContext<TrayManager | null>(null);

export const TrayProvider = ({ manager, children }: TrayProviderProps) => {
  return (
    <TrayContext.Provider value={manager}>
      <RootMenuProvider onRootMenuChange={manager.setContextMenu}>
        {children}
      </RootMenuProvider>
    </TrayContext.Provider>
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

export const TrayMenu = Menu;

export const TrayMenuItem = MenuItem;

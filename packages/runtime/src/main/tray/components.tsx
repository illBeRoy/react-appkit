import { createContext, useContext, useEffect } from 'react';
import type { TrayManager } from './trayManager';

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
  message = 'Cannot mount Tray components outside of a Tray Manager context';
}

const useTrayManager = () => {
  const context = useContext(TrayContext);

  if (!context) {
    throw new TrayManagerContextError();
  }

  return context;
};

export interface TrayProps {}

export const Tray = ({}: TrayProps) => {
  const manager = useTrayManager();

  useEffect(() => {
    manager.create();
    return () => manager.destroy();
  }, []);

  return null;
};

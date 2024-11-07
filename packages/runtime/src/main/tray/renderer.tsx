import { useEffect, useRef } from 'react';
import { render } from 'react-nil';
import { TrayProvider } from './components';
import { createTrayManager } from './trayManager';

export const renderTray = (RootComponent: React.ComponentType) => {
  const trayManager = createTrayManager();
  render(
    <TrayProvider manager={trayManager}>
      <RootComponent />
    </TrayProvider>,
  );
};

export const useFirstRender = (fnToRunOnFirstRender: () => void) => {
  const firstRenderRef = useRef(true);

  if (firstRenderRef.current) {
    fnToRunOnFirstRender();
    firstRenderRef.current = false;
  }
};

export const useUnmount = (fnToRunOnUnmount: () => void) => {
  useEffect(() => {
    return () => fnToRunOnUnmount();
  }, []);
};

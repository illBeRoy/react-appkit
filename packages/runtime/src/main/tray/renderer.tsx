import { useEffect, useRef } from 'react';
import { render } from 'react-nil';
import { createTrayManager } from './trayManager';
import { TrayProvider } from './components';
import { MainProcessGlobalStateProvider } from '../globalState/MainProcessGlobalStateProvider';

export const renderTray = (RootComponent: React.ComponentType) => {
  const trayManager = createTrayManager();
  render(
    <TrayProvider manager={trayManager}>
      <MainProcessGlobalStateProvider>
        <RootComponent />
      </MainProcessGlobalStateProvider>
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

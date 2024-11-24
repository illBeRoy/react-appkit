import { ErrorBoundary } from 'react-error-boundary';
import { createTrayManager } from './trayManager';
import { TrayProvider } from './components';
import { MainProcessGlobalStateProvider } from '../globalState/MainProcessGlobalStateProvider';

export const wrapTray = (RootComponent: React.ComponentType) => {
  const trayManager = createTrayManager();

  return function TrayBaseComponent() {
    return (
      <TrayProvider manager={trayManager}>
        <MainProcessGlobalStateProvider>
          <ErrorBoundary fallback={<></>} onError={console.error}>
            <RootComponent />
          </ErrorBoundary>
        </MainProcessGlobalStateProvider>
      </TrayProvider>
    );
  };
};

import { ErrorBoundary } from 'react-error-boundary';
import { renderInNode } from '../nodeRenderer/renderer';
import { createTrayManager } from './trayManager';
import { TrayProvider } from './components';
import { MainProcessGlobalStateProvider } from '../globalState/MainProcessGlobalStateProvider';

export const renderTray = (RootComponent: React.ComponentType) => {
  const trayManager = createTrayManager();

  renderInNode(
    <TrayProvider manager={trayManager}>
      <MainProcessGlobalStateProvider>
        <ErrorBoundary fallback={<></>} onError={console.error}>
          <RootComponent />
        </ErrorBoundary>
      </MainProcessGlobalStateProvider>
    </TrayProvider>,
  );
};

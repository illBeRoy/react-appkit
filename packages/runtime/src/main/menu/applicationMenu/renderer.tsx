import { renderInNode } from '../../nodeRenderer/renderer';
import { MainProcessGlobalStateProvider } from '../../globalState/MainProcessGlobalStateProvider';
import { createMenuManager } from './menuManager';
import { EmptyMenu, MenuManagerProvider } from './components';
import { ErrorBoundary } from 'react-error-boundary';

export const renderApplicationMenu = (RootComponent: React.ComponentType) => {
  const menuManager = createMenuManager();
  menuManager.setMenu(null);

  renderInNode(
    <MenuManagerProvider value={menuManager}>
      <MainProcessGlobalStateProvider>
        <ErrorBoundary FallbackComponent={EmptyMenu} onError={console.error}>
          <RootComponent />
        </ErrorBoundary>
      </MainProcessGlobalStateProvider>
    </MenuManagerProvider>,
  );
};

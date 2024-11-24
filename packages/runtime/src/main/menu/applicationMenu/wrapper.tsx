import { MainProcessGlobalStateProvider } from '../../globalState/MainProcessGlobalStateProvider';
import { createMenuManager } from './menuManager';
import { EmptyMenu, MenuManagerProvider } from './components';
import { ErrorBoundary } from 'react-error-boundary';
import { useFirstRender } from '../../nodeRenderer/hooks';

export const wrapApplicationMenu = (RootComponent: React.ComponentType) => {
  const menuManager = createMenuManager();

  return function ApplicationMenuBaseComponent() {
    useFirstRender(() => {
      menuManager.setMenu(null);
    });

    return (
      <MenuManagerProvider value={menuManager}>
        <MainProcessGlobalStateProvider>
          <ErrorBoundary FallbackComponent={EmptyMenu} onError={console.error}>
            <RootComponent />
          </ErrorBoundary>
        </MainProcessGlobalStateProvider>
      </MenuManagerProvider>
    );
  };
};

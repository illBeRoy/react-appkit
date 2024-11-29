import { MainProcessGlobalStateProvider } from '../../globalState/MainProcessGlobalStateProvider';
import { createMenuManager } from './menuManager';
import { EmptyMenu, MenuManagerProvider } from './components';
import { ErrorBoundary } from 'react-error-boundary';
import { useFirstRender } from '../../nodeRenderer/hooks';
import { createForceRenderer } from '../../nodeRenderer/forceRender';

export const wrapApplicationMenu = (RootComponent: React.ComponentType) => {
  const [useForceRenderer, forceRender] = createForceRenderer();
  let jsx = (
    <MenuManagerProvider value={createMenuManager()}>
      <RootComponent />
    </MenuManagerProvider>
  );

  function replace(NewComponent: React.ComponentType) {
    jsx = (
      <MenuManagerProvider value={createMenuManager()}>
        <NewComponent />
      </MenuManagerProvider>
    );
    forceRender();
  }

  function ApplicationMenuBaseComponent() {
    useForceRenderer();

    return (
      <MainProcessGlobalStateProvider>
        <ErrorBoundary FallbackComponent={EmptyMenu} onError={console.error}>
          {jsx}
        </ErrorBoundary>
      </MainProcessGlobalStateProvider>
    );
  }

  return {
    Component: ApplicationMenuBaseComponent,
    replace,
  };
};

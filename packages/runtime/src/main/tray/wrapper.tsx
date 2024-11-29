import { ErrorBoundary } from 'react-error-boundary';
import { createTrayManager } from './trayManager';
import { TrayProvider } from './components';
import { MainProcessGlobalStateProvider } from '../globalState/MainProcessGlobalStateProvider';
import { createForceRenderer } from '../nodeRenderer/forceRender';

export const wrapTray = (RootComponent: React.ComponentType | null) => {
  // const trayManager = createTrayManager();
  const forceRenderer = createForceRenderer();

  let jsx = RootComponent ? (
    <TrayProvider key={Date.now()} manager={createTrayManager()}>
      <RootComponent />
    </TrayProvider>
  ) : null;

  function replace(NewComponent: React.ComponentType | null) {
    jsx = NewComponent ? (
      <TrayProvider key={Date.now()} manager={createTrayManager()}>
        <NewComponent />
      </TrayProvider>
    ) : null;
    forceRenderer.forceRender();
  }

  function TrayBaseComponent() {
    forceRenderer.hook();

    return (
      <MainProcessGlobalStateProvider>
        <ErrorBoundary fallback={<></>} onError={console.error}>
          {jsx}
        </ErrorBoundary>
      </MainProcessGlobalStateProvider>
    );
  }

  return {
    Component: TrayBaseComponent,
    replace,
  };
};

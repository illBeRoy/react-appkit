import { ErrorBoundary } from 'react-error-boundary';
import { createTrayManager } from './trayManager';
import { TrayProvider } from './components';
import { MainProcessGlobalStateProvider } from '../globalState/MainProcessGlobalStateProvider';
import { createForceRenderer } from '../nodeRenderer/forceRender';

export const wrapTray = (RootComponent: React.ComponentType | null) => {
  const [useForceRenderer, forceRender] = createForceRenderer();

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
    forceRender();
  }

  function TrayBaseComponent() {
    useForceRenderer();

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

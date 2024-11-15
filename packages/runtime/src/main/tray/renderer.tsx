import { renderInNode } from '../nodeRenderer/renderer';
import { createTrayManager } from './trayManager';
import { TrayProvider } from './components';
import { MainProcessGlobalStateProvider } from '../globalState/MainProcessGlobalStateProvider';

export const renderTray = (RootComponent: React.ComponentType) => {
  const trayManager = createTrayManager();
  renderInNode(
    <TrayProvider manager={trayManager}>
      <MainProcessGlobalStateProvider>
        <RootComponent />
      </MainProcessGlobalStateProvider>
    </TrayProvider>,
  );
};

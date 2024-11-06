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

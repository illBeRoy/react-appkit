import { useEffect, useState } from 'react';
import { GlobalStateContext } from '../../shared/globalState/reactContext';
import { globalStateUpdatesPublisher, globalStore } from './store';

export interface MainProcessGlobalStateProviderProps {
  children: React.ReactNode;
}

export const MainProcessGlobalStateProvider = ({
  children,
}: MainProcessGlobalStateProviderProps) => {
  const [globalState, setGlobalState] = useState<Record<string, unknown>>(
    () => ({
      ...globalStore(),
    }),
  );

  useEffect(() => {
    function fetchGlobalState() {
      const globalState = { ...globalStore() };
      setGlobalState(globalState);
    }

    globalStateUpdatesPublisher.on('change', fetchGlobalState);

    fetchGlobalState();
  }, []);

  return (
    <GlobalStateContext.Provider value={globalState}>
      {children}
    </GlobalStateContext.Provider>
  );
};

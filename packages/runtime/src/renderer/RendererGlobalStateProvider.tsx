import { useEffect, useState } from 'react';
import { getEntireGlobalState } from '@react-appkit/runtime/main/api/global';
import { GlobalStateContext } from '../shared/globalState/reactContext';

export interface RendererGlobalStateProviderProps {
  children: React.ReactNode;
  onReady: () => void;
}

export const RendererGlobalStateProvider = ({
  children,
  onReady,
}: RendererGlobalStateProviderProps) => {
  const [globalState, setGlobalState] = useState<Record<string, unknown>>({});
  const [isGlobalStateReady, setIsGlobalStateReady] = useState(false);

  useEffect(() => {
    async function fetchGlobalState() {
      const globalState = await getEntireGlobalState();
      setGlobalState(globalState);
      setIsGlobalStateReady(true);
    }

    // @ts-expect-error window.__globalState__ is defined in ipcPreloadScript
    window.__globalState__.addEventListener(() => {
      fetchGlobalState();
    });

    fetchGlobalState();
  }, []);

  useEffect(() => {
    if (isGlobalStateReady) {
      onReady();
    }
  }, [isGlobalStateReady]);

  if (!isGlobalStateReady) {
    return null;
  }

  return (
    <GlobalStateContext.Provider value={globalState}>
      {children}
    </GlobalStateContext.Provider>
  );
};

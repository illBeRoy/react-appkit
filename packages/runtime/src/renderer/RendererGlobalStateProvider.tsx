import { useEffect, useRef, useState } from 'react';
import {
  getEntireGlobalState,
  setGlobalState,
} from '@react-appkit/runtime/main/api/global';
import {
  GlobalStateContext,
  type GlobalStateContainer,
} from '../shared/globalState/reactContext';
import type { GlobalStateValue } from '../shared/globalState/value';

export interface RendererGlobalStateProviderProps {
  children: React.ReactNode;
  onReady: () => void;
}

export const RendererGlobalStateProvider = ({
  children,
  onReady,
}: RendererGlobalStateProviderProps) => {
  const globalState = useRef<Record<string, GlobalStateValue | undefined>>({});
  const listeners = useRef<
    Record<string, Set<(val: GlobalStateValue) => void>>
  >({});

  const [isGlobalStateReady, setIsGlobalStateReady] = useState(false);

  useEffect(() => {
    async function fetchGlobalState() {
      globalState.current = await getEntireGlobalState();

      Object.entries(listeners.current).forEach(([key, listeners]) => {
        listeners.forEach((listener) => {
          listener(globalState.current[key]!);
        });
      });

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

  const globalStateContainer: GlobalStateContainer = {
    hasKey: (key: string) => key in globalState.current,
    getValue: (key: string) => globalState.current[key],
    setValue: (key: string, value: GlobalStateValue) => {
      setGlobalState(key, value);
    },
    addListener: (key: string, listener: (val: GlobalStateValue) => void) => {
      if (!(key in listeners.current)) {
        listeners.current[key] = new Set();
      }
      listeners.current[key].add(listener);
    },
    removeListener: (
      key: string,
      listener: (val: GlobalStateValue) => void,
    ) => {
      if (key in listeners.current) {
        listeners.current[key].delete(listener);
      }
    },
  };

  return (
    <GlobalStateContext.Provider value={globalStateContainer}>
      {children}
    </GlobalStateContext.Provider>
  );
};

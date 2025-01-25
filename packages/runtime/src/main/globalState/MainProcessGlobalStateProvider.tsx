import { useEffect, useRef } from 'react';
import {
  GlobalStateContext,
  type GlobalStateContainer,
} from '../../shared/globalState/reactContext';
import type { GlobalStateValue } from '../../shared/globalState/value';
import {
  getGlobalState,
  globalStateUpdatesPublisher,
  globalStore,
  setGlobalState,
} from './store';

export interface MainProcessGlobalStateProviderProps {
  children: React.ReactNode;
}

export const MainProcessGlobalStateProvider = ({
  children,
}: MainProcessGlobalStateProviderProps) => {
  const listeners = useRef<
    Record<string, Set<(val: GlobalStateValue) => void>>
  >({});

  const globalStateContainer: GlobalStateContainer = {
    hasKey: (key: string) => key in globalStore(),
    getValue: (key: string) => getGlobalState(key),
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

  useEffect(() => {
    const unbind = globalStateUpdatesPublisher.on('change', () => {
      Object.entries(listeners.current).forEach(([key, listeners]) => {
        listeners.forEach((listener) => {
          listener(getGlobalState(key)!);
        });
      });
    });

    return unbind;
  }, []);

  return (
    <GlobalStateContext.Provider value={globalStateContainer}>
      {children}
    </GlobalStateContext.Provider>
  );
};

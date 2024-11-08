import { createContext, useContext } from 'react';

export const GlobalStateContext = createContext<Record<string, unknown>>({});

export const useEntireGlobalState = () => {
  const globalState = useContext(GlobalStateContext);

  if (!globalState) {
    throw new NoGlobalStateProviderError();
  }

  return globalState;
};

export class NoGlobalStateProviderError extends Error {
  name = 'NoGlobalStateProviderError';
  message =
    'This hook was not run inside a component that runs in a context that has access to the global state.\n' +
    'Please make sure to only use this hook in components used inside a window or the tray.\n' +
    'If you have and you still see this message, please report this bug.';
}

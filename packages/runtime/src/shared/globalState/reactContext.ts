import { createContext, useContext, useEffect, useState } from 'react';
import { toGlobalStateValue, type GlobalStateValue } from './value';

export interface GlobalStateContainer {
  hasKey: (key: string) => boolean;
  getValue: (key: string) => GlobalStateValue | undefined;
  setValue: (key: string, value: GlobalStateValue) => void;
  addListener: (key: string, listener: (val: GlobalStateValue) => void) => void;
  removeListener: (
    key: string,
    listener: (val: GlobalStateValue) => void,
  ) => void;
}

export const GlobalStateContext = createContext<GlobalStateContainer | null>(
  null,
);

export const useGlobalState = <T>(
  key: string,
  defaultValue: T,
): [state: T, setState: (value: T) => void] => {
  const globalState = useContext(GlobalStateContext);

  if (!globalState) {
    throw new NoGlobalStateProviderError();
  }

  const [value, setValue] = useState<GlobalStateValue<T>>(
    globalState.hasKey(key)
      ? (globalState.getValue(key) as GlobalStateValue<T>)
      : toGlobalStateValue(defaultValue),
  );

  if (!globalState.hasKey(key)) {
    globalState.setValue(key, value);
  }

  useEffect(() => {
    function onStateChange(newValue: GlobalStateValue) {
      if (newValue.updatedAt > value.updatedAt) {
        setValue(newValue as GlobalStateValue<T>);
      }
    }

    globalState.addListener(key, onStateChange);

    return () => {
      globalState.removeListener(key, onStateChange);
    };
  }, [value]);

  const setState = (data: T) => {
    const newValue = toGlobalStateValue(data);
    setValue(newValue);
    globalState.setValue(key, newValue);
  };

  return [value.data, setState];
};

export class NoGlobalStateProviderError extends Error {
  name = 'NoGlobalStateProviderError';
  message =
    'This hook was not run inside a component that runs in a context that has access to the global state.\n' +
    'Please make sure to only use this hook in components used inside a window, application menu, or the tray.\n' +
    'If you have and you still see this message, please report this bug.';
}

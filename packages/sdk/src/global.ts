import {
  setGlobalState,
  getGlobalState,
} from '@react-appkit/runtime/main/api/global';
import { useEntireGlobalState } from '@react-appkit/runtime/shared/globalState/reactContext';

export const useGlobalState = <T>(
  key: string,
  defaultValueOrFn: T | (() => T),
): [value: T, setValue: (value: T) => void] => {
  const globalState = useEntireGlobalState();

  const setValue = (value: T) => {
    setGlobalState(key, value);
  };

  if (globalState[key] === undefined) {
    const defaultValue =
      typeof defaultValueOrFn === 'function'
        ? (defaultValueOrFn as () => T)()
        : defaultValueOrFn;

    setGlobalState(key, defaultValue);
    return [defaultValue, setValue];
  }

  return [globalState[key] as T, setValue];
};

export { getGlobalState, setGlobalState };

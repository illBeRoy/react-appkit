/**
 
 * APIs to access the global state.
 * The global state is a store fully shared and synced between the main and renderer processes.
 * This means that all changes to the global state are immediately reflected in every open window, as well as actions, tray, app menu, etc.
 */

import {
  setGlobalState,
  getGlobalState,
} from '@react-appkit/runtime/main/api/global';
import { useEntireGlobalState } from '@react-appkit/runtime/shared/globalState/reactContext';

/**
 * React hook to access the global state.
 * @param key - The key to access within the global state.
 * @param defaultValueOrFn - The default value or a function to generate the default value.
 * @returns A tuple with the current value and a function to set the value (similar to useState).
 */
export const useGlobalState = <T>(
  key: string,
  defaultValueOrFn: T | (() => T),
): [value: T, setValue: (value: T) => void] => {
  const globalState = useEntireGlobalState();

  const setValue = (value: T) => {
    globalState[key] = value;
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

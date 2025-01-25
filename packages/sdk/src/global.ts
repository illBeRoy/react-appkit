/**
 
 * APIs to access the global state.
 * The global state is a store fully shared and synced between the main and renderer processes.
 * This means that all changes to the global state are immediately reflected in every open window, as well as actions, tray, app menu, etc.
 */

import {
  setGlobalState as _setGlobalState,
  getGlobalState as _getGlobalState,
} from '@react-appkit/runtime/main/api/global';
import { useGlobalState as _useGlobalState } from '@react-appkit/runtime/shared/globalState/reactContext';
import { toGlobalStateValue } from '@react-appkit/runtime/shared/globalState/value';

/**
 * React hook to access the global state.
 * @param key - The key to access within the global state.
 * @param defaultValueOrFn - The default value or a function to generate the default value.
 * @returns A tuple with the current value and a function to set the value (similar to useState).
 */
export const useGlobalState = _useGlobalState;

/**
 * Get the latest global state value for a given key.
 * If using from a React component, prefer using the `useGlobalState` hook instead.
 * @param key - The key to access within the global state.
 * @returns The value of the global state for the given key, or undefined if the key does not exist.
 */
export function getGlobalState<T>(key: string): Promise<T | undefined> {
  return _getGlobalState(key).then((value) => value?.data as T | undefined);
}

/**
 * Set the global state value for a given key.
 * If using from a React component, prefer using the `useGlobalState` hook instead.
 * @param key - The key to access within the global state.
 * @param value - The value to set for the given key.
 */
export function setGlobalState(key: string, value: unknown): void {
  _setGlobalState(key, toGlobalStateValue(value));
}

import {
  setGlobalState,
  getGlobalState,
} from '@react-appkit/runtime/main/api/global';
import { useEntireGlobalState } from '@react-appkit/runtime/shared/globalState/reactContext';

export const useGlobalState = <T>(
  key: string,
  defaultValue: T,
): [value: T, setValue: (value: T) => void] => {
  const globalState = useEntireGlobalState();

  if (globalState[key] === undefined) {
    setGlobalState(key, defaultValue);
  }

  const setValue = (value: T) => {
    setGlobalState(key, value);
  };

  return [
    globalState[key] !== undefined ? (globalState[key] as T) : defaultValue,
    setValue,
  ];
};

export { getGlobalState, setGlobalState };

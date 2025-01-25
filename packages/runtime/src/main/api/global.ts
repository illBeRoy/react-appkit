import type { GlobalStateValue } from '../../shared/globalState/value';
import {
  globalStore,
  getGlobalState as storeGetGlobalState,
  setGlobalState as storeSetGlobalState,
} from '../globalState/store';

export async function getGlobalState<T>(key: string) {
  return storeGetGlobalState<T>(key);
}

export async function setGlobalState(key: string, value: GlobalStateValue) {
  storeSetGlobalState(key, value);
}

export async function getEntireGlobalState() {
  return { ...globalStore() };
}

import {
  globalStore,
  getGlobalState as storeGetGlobalState,
  setGlobalState as storeSetGlobalState,
} from '../globalState/store';

export async function getGlobalState<T>(key: string): Promise<T | undefined> {
  return storeGetGlobalState(key);
}

export async function setGlobalState(key: string, value: unknown) {
  storeSetGlobalState(key, value);
}

export async function getEntireGlobalState() {
  return { ...globalStore() };
}

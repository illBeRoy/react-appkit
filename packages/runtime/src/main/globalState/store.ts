import { createNanoEvents } from 'nanoevents';
import type { GlobalStateValue } from '../../shared/globalState/value';

// @ts-expect-error global.__reactAppkitGlobalStore this is the only place where this value is defined and going to be used
global.__reactAppkitGlobalStore ??= {};

export const globalStore = (): Record<string, GlobalStateValue> => {
  // @ts-expect-error global.__reactAppkitGlobalStore this is the only place where this value is defined and going to be used
  return global.__reactAppkitGlobalStore;
};

export const getGlobalState = <T>(
  key: string,
): GlobalStateValue<T> | undefined => {
  return globalStore()[key] as GlobalStateValue<T> | undefined;
};

export const setGlobalState = (key: string, value: GlobalStateValue) => {
  if (
    !(key in globalStore()) ||
    globalStore()[key].updatedAt < value.updatedAt
  ) {
    globalStore()[key] = value;
    globalStateUpdatesPublisher.emit('change');
  }
};

export const globalStateUpdatesPublisher = createNanoEvents<{
  change: () => void;
}>();

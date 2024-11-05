import type { IpcMainInvokeEvent } from 'electron';
import { AsyncLocalStorage } from 'node:async_hooks';

const callerContext = new AsyncLocalStorage<IpcMainInvokeEvent>();

export const attachCallerContextWhenCallingApiFromWindow = (
  event: IpcMainInvokeEvent,
  fn: (...args: unknown[]) => unknown,
  ...args: unknown[]
) => {
  return callerContext.run(event, () => fn(...args));
};

export const useCallerContext = () => {
  const context = callerContext.getStore();

  if (!context) {
    throw new NoContextError();
  }

  return context;
};

export const useSender = () => useCallerContext().sender;

export class NoContextError extends Error {
  name = 'NoContextError';
  message = 'No caller context found';
}

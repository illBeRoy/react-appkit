import { ipcMain } from 'electron';
import type { ActionNamespace, ActionsRegistry } from './registry';
import { callFunctionWithWindowContext } from './context';

export interface InvokeRequest {
  namespace: ActionNamespace;
  filename: string;
  fnName: string;
  params: unknown[];
  invokeId: number;
}

export class MainProcessApiNotFoundError extends Error {
  name = 'MainProcessApiNotFoundError';
  constructor(fnName: string, filename: string) {
    super(
      `You tried to invoke ${fnName} (from file "${filename}") in the main process, but it was never exposed from it to begin with`,
    );
  }
}

export const startIpcBridge = (actionsRegistry: ActionsRegistry) => {
  ipcMain.handle(
    'invokeMainProcessApi',
    async (event, invokeRequest: InvokeRequest) => {
      const fn = actionsRegistry.getAction(
        invokeRequest.namespace,
        invokeRequest.filename,
        invokeRequest.fnName,
      );

      if (!fn) {
        throw new MainProcessApiNotFoundError(
          invokeRequest.fnName,
          invokeRequest.filename,
        );
      }

      return callFunctionWithWindowContext(event, fn, ...invokeRequest.params);
    },
  );
};

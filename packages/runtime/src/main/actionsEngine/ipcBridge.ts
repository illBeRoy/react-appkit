import { ipcMain, type WebContents } from 'electron';
import type { ActionNamespace, ActionsRegistry } from './registry';
import { callFunctionWithWindowContext } from './context';

export interface InvokeRequest {
  namespace: ActionNamespace;
  filename: string;
  fnName: string;
  params: unknown[];
  invokeId: number;
}

export type InvokeResponse =
  | {
      event: 'invokeMainProcessApiResult';
      invokeId: number;
      returnValue: unknown;
    }
  | {
      event: 'invokeMainProcessApiError';
      invokeId: number;
      error: {
        name: string;
        message: string;
        stack?: string;
      };
    };

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
        return sendResponseToRenderer(event.sender, {
          event: 'invokeMainProcessApiError',
          invokeId: invokeRequest.invokeId,
          error: {
            name: 'MainProcessApiNotFoundError',
            message: `You tried to invoke ${invokeRequest.fnName} (from file "${invokeRequest.filename}") in the main process, but it was never exposed from it to begin with`,
          },
        });
      }

      await callFunctionWithWindowContext(event, fn, ...invokeRequest.params)
        .then((returnValue: unknown) =>
          sendResponseToRenderer(event.sender, {
            event: 'invokeMainProcessApiResult',
            invokeId: invokeRequest.invokeId,
            returnValue,
          }),
        )
        .catch((error: Error) =>
          sendResponseToRenderer(event.sender, {
            event: 'invokeMainProcessApiError',
            invokeId: invokeRequest.invokeId,
            error: {
              name: error.name,
              message: error.message,
              stack: error.stack,
            },
          }),
        );
    },
  );
};

const sendResponseToRenderer = (
  webContents: WebContents,
  response: InvokeResponse,
) => {
  return webContents.executeJavaScript(
    `window.postMessage(${JSON.stringify(response)})`,
  );
};

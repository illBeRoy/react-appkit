import { ipcMain, type WebContents } from 'electron';
import type { ApisMap } from './exposedApis';
import { callFunctionWithWindowContext } from './context';

export interface InvokeRequest {
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

export const startIpcBridge = (exposedApis: ApisMap) => {
  ipcMain.handle(
    'invokeMainProcessApi',
    async (event, invokeRequest: InvokeRequest) => {
      const fn = exposedApis.get(invokeRequest.fnName);

      if (!fn) {
        return sendResponseToRenderer(event.sender, {
          event: 'invokeMainProcessApiError',
          invokeId: invokeRequest.invokeId,
          error: {
            name: 'MainProcessApiNotFoundError',
            message: `You tried to invoke ${invokeRequest.fnName} in the main process, but it was never exposed from it`,
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

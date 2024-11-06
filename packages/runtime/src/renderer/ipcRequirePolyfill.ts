import type { ActionNamespace } from '../main/actionsEngine/actionsRegistry'; // eslint-disable-line
import type { InvokeRequest, InvokeResponse } from '../main/actionsEngine/ipcBridge'; // eslint-disable-line

let invokeId = 0;

// @ts-expect-error window.require is defined here and therefore has no type
window.require = (module: string) => {
  let actionNamespace: ActionNamespace | undefined;
  if (module.startsWith('@react-appkit/runtime/main/api/')) {
    actionNamespace = 'builtin';
  }

  if (module.startsWith('./src/actions/')) {
    actionNamespace = 'user';
  }

  if (!actionNamespace) {
    throw new Error(`Module ${module} not found. Was it not bundled?`);
  }

  if (!module.endsWith('.ts')) {
    module = `${module}.ts`;
  }

  return new Proxy(
    {},
    {
      get:
        (_, fnName) =>
        (...params: unknown[]) => {
          const invokeRequest: InvokeRequest = {
            namespace: actionNamespace,
            filename: module,
            fnName: String(fnName),
            invokeId: invokeId++,
            params,
          };

          return new Promise((resolve, reject) => {
            function handleMessage(event: MessageEvent<InvokeResponse>) {
              if (typeof event.data !== 'object' || !event.data) {
                return;
              }

              if (
                event.data.event === 'invokeMainProcessApiResult' &&
                event.data.invokeId === invokeRequest.invokeId
              ) {
                window.removeEventListener('message', handleMessage);
                resolve(event.data.returnValue);
                return;
              }

              if (
                event.data.event === 'invokeMainProcessApiError' &&
                event.data.invokeId === invokeRequest.invokeId
              ) {
                const error = new Error();
                error.name = event.data.error.name;
                error.message = event.data.error.message;
                error.stack ??= event.data.error.stack;

                window.removeEventListener('message', handleMessage);
                reject(error);
                return;
              }
            }

            window.addEventListener('message', handleMessage);

            // @ts-expect-error window.__invokeMainProcessApi__ is defined implicitly in the preload script
            window.__invokeMainProcessApi__(invokeRequest);
          });
        },
    },
  );
};

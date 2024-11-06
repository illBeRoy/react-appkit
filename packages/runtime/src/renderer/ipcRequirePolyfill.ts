import type { InvokeRequest, InvokeResponse } from '../main/ipcBridge'; // eslint-disable-line

let invokeId = 0;

// @ts-expect-error window.require is defined here and therefore has no type
window.require = (module: string) => {
  let apiNamespace;
  if (module.startsWith('@react-appkit/runtime/main/api/')) {
    apiNamespace = module.split('/').pop();
  }

  if (module.startsWith('./src/actions/')) {
    apiNamespace = `user.${module.split('/actions/').pop()?.replaceAll('.ts', '').replaceAll('/', '.')}`;
  }

  if (!apiNamespace) {
    throw new Error(`Module ${module} not found. Was it not bundled?`);
  }

  return new Proxy(
    {},
    {
      get:
        (_, fnName) =>
        (...params: unknown[]) => {
          const invokeRequest: InvokeRequest = {
            fnName: `${apiNamespace}.${String(fnName)}`,
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

import type { ActionNamespace } from '../main/actionsEngine/registry'; // eslint-disable-line
import type { InvokeRequest } from '../main/actionsEngine/ipcBridge'; // eslint-disable-line

let invokeId = 0;

// @ts-expect-error window.importIpc is defined here and therefore has no type
window.importIpc = (module: string) => {
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

          // @ts-expect-error window.__invokeMainProcessApi__ is defined implicitly in the preload script
          return window.__invokeMainProcessApi__(invokeRequest);
        },
    },
  );
};

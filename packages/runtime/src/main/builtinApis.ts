import path from 'node:path';
import type { ActionsRegistry } from './actionsEngine/actionsRegistry';

export async function exposeBuiltinApisAsActionsInto(
  actionsRegistry: ActionsRegistry,
) {
  const apiModules = import.meta.glob('./api/*.ts');

  await Promise.all(
    Object.entries(apiModules).map(async ([moduleFilename, module]) => {
      const namespace = 'builtin';
      const filename = `@react-appkit/runtime/main/api/${path.basename(
        moduleFilename,
        '.ts',
      )}.ts`;
      const exported = (await module()) as Record<string, unknown>; // all modules in the API folder are ESM so we can assume they're all Records

      Object.entries(exported).forEach(([key, value]) => {
        if (typeof value === 'function') {
          actionsRegistry.registerAction(namespace, filename, key, value);
        }
      });
    }),
  );
}

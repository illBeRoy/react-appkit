import path from 'node:path';

export async function exposedApis() {
  const apiModules = import.meta.glob('./api/*.ts');

  const apisMap = new Map<string, (...args: unknown[]) => unknown>();

  await Promise.all(
    Object.entries(apiModules).map(async ([filename, module]) => {
      const namespace = path.basename(filename, '.ts');
      const exported = (await module()) as Record<string, unknown>; // all modules in the API folder are ESM so we can assume they're all Records

      Object.entries(exported).forEach(([key, value]) => {
        if (typeof value === 'function') {
          apisMap.set(
            `${namespace}.${key}`,
            value as (...args: unknown[]) => unknown,
          );
        }
      });
    }),
  );

  return apisMap;
}

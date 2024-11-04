import path from 'node:path';
import type { Plugin } from 'vite';

export const virtualFiles = (virtualFiles: Record<string, string>): Plugin => ({
  name: '@react-appkit:virtual-files',
  resolveId(id: string) {
    if (id in virtualFiles) {
      return id;
    }
  },
  load(id: string) {
    if (id in virtualFiles) {
      return virtualFiles[id];
    }
  },
});

export const externalizeMainProcessDeps = (): Plugin => ({
  name: '@react-appkit:externalize-node-modules',
  config: (config) => {
    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.external ??= [];
    (config.build.rollupOptions.external as string[]).push('electron');
    (config.build.rollupOptions.external as RegExp[]).push(/^node:.+/);
  },
});

export const modulePolyfill = (
  module: string | RegExp,
  fn: (moduleName: string) => string,
): Plugin => ({
  name: '@react-appkit:polyfill-module',
  enforce: 'pre',
  resolveId(id: string) {
    if (typeof module === 'string' && id === module) {
      return id;
    }
    if (module instanceof RegExp && module.test(id)) {
      return id;
    }
  },
  load(id: string) {
    if (typeof module === 'string' && id === module) {
      return fn(id);
    }
    if (module instanceof RegExp && module.test(id)) {
      return fn(id);
    }
  },
});

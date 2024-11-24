import type { Plugin } from 'vite';

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

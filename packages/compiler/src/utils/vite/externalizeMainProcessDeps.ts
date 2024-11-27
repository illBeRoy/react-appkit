import type { Plugin } from 'vite';

/**
 * This plugin ensures that the `electron` module and all node built-in modules are externalized when building the main process.
 *
 * @returns A Vite plugin
 */
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

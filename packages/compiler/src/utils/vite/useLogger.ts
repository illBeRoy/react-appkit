import type { Plugin } from 'vite';

export const silent = (): Plugin => ({
  name: '@react-appkit:logger',
  config(config) {
    config.logLevel = 'silent';
    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.onwarn = () => {};
    config.build.rollupOptions.onLog = () => {};
  },
});

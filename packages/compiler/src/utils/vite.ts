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

export const removeAbsolutePaths = (rootDir: string): Plugin => ({
  name: '@react-appkit:remove-absolute-paths',
  generateBundle(_, bundle) {
    Object.values(bundle).forEach((file) => {
      if (file.type === 'chunk') {
        file.code = file.code.replaceAll(rootDir, '.');
      }
    });
  },
});

export interface DevServerVitePluginOptions {
  port: number;
}

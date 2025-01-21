import path from 'node:path';
import * as vite from 'vite';
import viteReact from '@vitejs/plugin-react';
import { virtualFiles } from '../utils/vite/virtualFiles';
import { ipcImportPolyfill } from '../utils/vite/ipcImportPolyfill';
import { devServer } from '../utils/vite/devServer';
import { silent } from '../utils/vite/useLogger';
import { templateDir } from '../utils/template';

export const rendererBuilder = (workDir: string) => {
  const baseCfg: vite.InlineConfig = {
    root: workDir,
    configFile: false,
    base: './',
    plugins: [
      silent(),
      virtualFiles(workDir, templateDir('renderer')),
      ipcImportPolyfill(workDir),
      viteReact(),
    ],
    build: {
      assetsDir: './',
      outDir: path.join('dist', 'renderer'),
      sourcemap: true,
      rollupOptions: {
        input: {
          app: './index.html',
          importPolyfill: '@react-appkit/runtime/renderer/ipcRequirePolyfill',
        },
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
    resolve: {
      dedupe: ['react-router-dom'],
    },
    optimizeDeps: {
      include: ['react-dom', 'react-dom/client'],
    },
  };

  async function buildForProduction() {
    const buildCfg = vite.mergeConfig(baseCfg, { mode: 'production' });
    await vite.build(buildCfg);
  }

  async function createDevServer(port: number) {
    const hmrCfg: vite.InlineConfig = {
      mode: 'development',
      plugins: [devServer()],
      logLevel: 'error',
      server: {
        port,
        hmr: {
          protocol: 'ws',
        },
      },
      optimizeDeps: {
        exclude: ['@react-appkit/sdk'],
      },
    };

    const devCfg = vite.mergeConfig(baseCfg, hmrCfg);

    return vite.createServer(devCfg);
  }

  return { buildForProduction, createDevServer };
};

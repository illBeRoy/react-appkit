import path from 'node:path';
import * as vite from 'vite';
import viteReact from '@vitejs/plugin-react';
import { removeAbsolutePaths, virtualFiles } from '../utils/vite';
import { templateFile } from '../utils/templateFile';

export const rendererBuilder = (workDir: string) => {
  const baseCfg: vite.InlineConfig = {
    root: workDir,
    base: './',
    plugins: [
      virtualFiles({
        './entrypoint.tsx': templateFile('renderer/entrypoint.tsx'),
        './index.html': templateFile('renderer/index.html'),
      }),
      removeAbsolutePaths(workDir),
      viteReact(),
    ],
    build: {
      assetsDir: './',
      outDir: path.join('dist', 'renderer'),
      sourcemap: true,
      rollupOptions: {
        input: {
          app: './index.html',
          requirePolyfill: '@react-appkit/runtime/renderer/ipcRequirePolyfill',
        },
        external: [
          /^@react-appkit\/runtime\/main\/api\/.+/,
          /\/src\/actions\/.+/,
        ],
        makeAbsoluteExternalsRelative: false,
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
        },
      },
    },
    resolve: {
      dedupe: ['react-router-dom'],
    },
  };

  async function buildForProduction() {
    const buildCfg = vite.mergeConfig(baseCfg, { mode: 'production' });
    await vite.build(buildCfg);
  }

  async function createDevServer(port: number) {
    const hmrCfg: vite.InlineConfig = {
      server: {
        port,
        hmr: {
          protocol: 'ws',
        },
      },
    };

    const devCfg = vite.mergeConfig(baseCfg, hmrCfg);

    await vite.build(devCfg);
    return vite.createServer(devCfg);
  }

  return { buildForProduction, createDevServer };
};

import path from 'node:path';
import * as vite from 'vite';
import viteReact from '@vitejs/plugin-react';
import { removeAbsolutePaths, virtualFiles } from '../utils/vite';
import { devServerVitePlugin } from '../../../dev-server/src/vite';
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

  async function buildForDev({ devServerPort }: { devServerPort: number }) {
    const watchCfg: vite.InlineConfig = {
      mode: 'development',
      plugins: [devServerVitePlugin({ port: devServerPort })],
      build: {
        watch: {
          include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
          exclude: ['node_modules/**', 'dist/**'],
        },
      },
    };

    const devCfg = vite.mergeConfig(baseCfg, watchCfg);

    return vite.build(devCfg) as Promise<vite.Rollup.RollupWatcher>;
  }

  return { buildForProduction, buildForDev };
};

import path from 'node:path';
import * as vite from 'vite';
import viteReact from '@vitejs/plugin-react';
import { removeAbsolutePaths, virtualFiles } from '../utils/vite';
import { templateFile } from '../utils/templateFile';

export async function buildRenderer(workDir: string) {
  await vite.build({
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
  });
}

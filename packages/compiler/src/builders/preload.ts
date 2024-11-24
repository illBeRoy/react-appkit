import path from 'node:path';
import * as vite from 'vite';
import { externalizeMainProcessDeps } from '../utils/vite/externalizeMainProcessDeps';
import { virtualFiles } from '../utils/vite/virtualFiles';
import { templateFile } from '../utils/templateFile';

export async function buildPreload(workDir: string) {
  await vite.build({
    root: workDir,
    configFile: false,
    plugins: [
      virtualFiles(workDir, {
        './preload.ts': templateFile('renderer/preload.ts'),
      }),
      externalizeMainProcessDeps(),
    ],
    build: {
      outDir: path.join('dist', 'preload'),
      target: 'node20',
      lib: {
        formats: ['cjs'],
        entry: './preload.ts',
        fileName: 'index',
      },
      rollupOptions: {
        output: {
          manualChunks: {},
        },
      },
    },
  });
}

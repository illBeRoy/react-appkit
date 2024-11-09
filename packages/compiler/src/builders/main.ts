#!/usr/bin/env node
import path from 'node:path';
import * as vite from 'vite';
import { externalizeMainProcessDeps, virtualFiles } from '../utils/vite';
import { templateFile } from '../utils/templateFile';

export async function buildMain(workDir: string) {
  await vite.build({
    root: workDir,
    plugins: [
      virtualFiles({
        [path.join(workDir, 'entrypoint.ts')]:
          await templateFile('main/entrypoint.ts'),
      }),
      externalizeMainProcessDeps(),
    ],
    build: {
      outDir: path.join('dist', 'main'),
      target: 'node20',
      lib: {
        formats: ['cjs'],
        entry: './entrypoint.ts',
        fileName: 'entrypoint',
      },
      rollupOptions: {
        external: ['electron', /node:/],
        output: {
          manualChunks: {},
        },
      },
    },
  });
}

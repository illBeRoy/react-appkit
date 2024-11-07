#!/usr/bin/env node
import path from 'node:path';
import * as vite from 'vite';
import { externalizeMainProcessDeps, virtualFiles } from '../utils/vite';
import { templateFile } from '../utils/templateFile';

export async function buildPreload(workDir: string) {
  await vite.build({
    root: workDir,
    plugins: [
      virtualFiles({
        [path.join(workDir, 'preload.ts')]: await templateFile(
          'renderer/preload.ts',
        ),
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

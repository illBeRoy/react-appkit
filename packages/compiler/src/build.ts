#!/usr/bin/env node
import path from 'node:path';
import * as vite from 'vite';
import viteReact from '@vitejs/plugin-react';
import { createWindowsMap } from './utils/createWindowsMap';
import { virtual } from './utils/vite';
import { templateFile } from './utils/templateFile';

async function buildMain(workDir: string) {
  await vite.build({
    root: workDir,
    plugins: [
      virtual({
        [path.join(workDir, 'entrypoint.ts')]:
          await templateFile('main/entrypoint.ts'),
      }),
    ],
    build: {
      outDir: path.resolve('dist', 'main'),
      target: 'node20',
      lib: {
        formats: ['cjs'],
        entry: './entrypoint.ts',
        fileName: 'entrypoint',
      },
      rollupOptions: {
        external: ['electron'],
        output: {
          manualChunks: {},
        },
      },
    },
  });
}

async function buildRenderer(workDir: string) {
  const windowsDir = path.join(workDir, 'src', 'windows');
  const windowsMap = await createWindowsMap(windowsDir);

  const allRoutes = Object.keys(windowsMap);
  const appTsx = `
    import { createHashRouter, RouterProvider } from 'react-router-dom';
    ${allRoutes.map((route, i) => `import RouteComponent${i} from ${JSON.stringify(`./${path.relative(workDir, windowsMap[route])}`)};`).join('\n')}

    const router = createHashRouter([
      ${allRoutes.map((route, i) => `{ path: ${JSON.stringify(route)}, element: <RouteComponent${i} /> }`).join(',\n')}
    ]);

    export default function App() {
      return <RouterProvider router={router} />;
    }
  `;

  await vite.build({
    root: workDir,
    base: '',
    plugins: [
      virtual({
        './App.tsx': appTsx,
        './entrypoint.tsx': await templateFile('renderer/entrypoint.tsx'),
        './index.html': await templateFile('renderer/index.html'),
      }),
      viteReact(),
    ],
    build: {
      outDir: path.resolve('dist', 'renderer'),
      rollupOptions: {
        input: './index.html',
        output: {
          manualChunks: {},
        },
      },
    },
  });
}

export async function build(workDir: string) {
  await Promise.all([buildMain(workDir), buildRenderer(workDir)]);
}

if (require.main === module) {
  build(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

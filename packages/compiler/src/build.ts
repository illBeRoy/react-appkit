#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs/promises';
import * as vite from 'vite';
import viteReact from '@vitejs/plugin-react';
import { createWindowsMap } from './utils/createWindowsMap';

const windowsDir = path.join('src', 'windows');

export async function build() {
  const windowsMap = await createWindowsMap(windowsDir);

  const allRoutes = Object.keys(windowsMap);
  const appTsx = `
    import { createHashRouter, RouterProvider } from 'react-router-dom';
    ${allRoutes.map((route, i) => `import RouteComponent${i} from ${JSON.stringify(`./${windowsMap[route]}`)};`).join('\n')}

    const router = createHashRouter([
      ${allRoutes.map((route, i) => `{ path: ${JSON.stringify(route)}, element: <RouteComponent${i} /> }`).join(',\n')}
    ]);

    export default function App() {
      return <RouterProvider router={router} />;
    }
  `;

  const virtualFiles: Record<string, string> = {
    './App.tsx': appTsx,
    './entrypoint.tsx': await fs.readFile(
      path.join(__dirname, '..', 'template', 'renderer', 'entrypoint.tsx'),
      'utf-8',
    ),
    './index.html': await fs.readFile(
      path.join(__dirname, '..', 'template', 'renderer', 'index.html'),
      'utf-8',
    ),
  };

  await vite.build({
    root: process.cwd(),
    plugins: [
      {
        name: '@react-appkit:virtual-files',
        resolveId(id: string) {
          if (id in virtualFiles) {
            return id;
          }
        },
        load(id: string) {
          console.log('load', id);
          return virtualFiles[id];
        },
      },
      viteReact(),
    ],
    build: {
      outDir: path.join(process.cwd(), 'dist', 'renderer'),
      rollupOptions: {
        input: './index.html',
      },
    },
  });
}

build().catch((error) => {
  console.error(
    error instanceof Error ? `[${error.name}] ${error.message}` : error,
  );
  process.exit(1);
});

import path from 'node:path';
import * as vite from 'vite';
import viteReact from '@vitejs/plugin-react';
import { createWindowsMap } from '../utils/createWindowsMap';
import { removeAbsolutePaths, virtualFiles } from '../utils/vite';
import { templateFile } from '../utils/templateFile';

export async function buildRenderer(workDir: string) {
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
    base: './',
    plugins: [
      virtualFiles({
        './App.tsx': appTsx,
        './entrypoint.tsx': await templateFile('renderer/entrypoint.tsx'),
        './index.html': await templateFile('renderer/index.html'),
      }),
      removeAbsolutePaths(workDir),
      viteReact(),
    ],
    build: {
      assetsDir: './',
      outDir: path.join('dist', 'renderer'),
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
  });
}

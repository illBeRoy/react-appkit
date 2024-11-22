import {
  render,
  type RenderOptions,
} from '@react-appkit/runtime/renderer/render';
import { dev } from '@react-appkit/dev-server/hook';

function main() {
  const allRouteModules = import.meta.glob(
    '/src/windows/**/*.{js,jsx,tsx,ts}',
    { eager: true },
  );

  const opts: RenderOptions = {
    routes: [],
    layouts: [],
  };

  for (const [filePath, exportedModule] of Object.entries(allRouteModules)) {
    if (
      !exportedModule ||
      typeof exportedModule !== 'object' ||
      !('default' in exportedModule) ||
      typeof exportedModule.default !== 'function' ||
      exportedModule.default.constructor.name === 'AsyncFunction'
    ) {
      throw new Error(
        `The ${filePath} file must provide a React component as the default export.`,
      );
    }

    const isLayout = /\/\[layout\]\.(ts|tsx|js|jsx)$/.test(filePath);

    if (isLayout) {
      const parentPath =
        filePath
          .slice('/src/windows'.length)
          .replace(/\/\[layout\]\.(ts|tsx|js|jsx)$/, '') || '/';
      opts.layouts.push({
        path: parentPath,
        component: exportedModule.default as React.ComponentType<any>, // eslint-disable-line
      });
    } else {
      const normalizedPath = filePath
        .slice('/src/windows'.length)
        .replace(/(\/index)?\.(ts|tsx|js|jsx)$/, '');

      opts.routes.push({
        path: normalizedPath || '/',
        component: exportedModule.default as React.ComponentType,
      });
    }
  }

  dev().onReload(() => window.location.reload());

  render(opts);
}

main();

import fs from 'node:fs/promises';
import path from 'node:path';

export interface WindowsMap {
  [route: string]: string;
}

export async function createWindowsMap(
  windowsDir: string,
): Promise<WindowsMap> {
  const windowsMap: WindowsMap = {};
  async function scanDir(atRoute: string) {
    const dirContents = await fs
      .readdir(path.join(windowsDir, atRoute))
      .catch(() => {
        throw new WindowsDirectoryNotFoundError(windowsDir);
      });

    await Promise.all(
      dirContents.map(async (item) => {
        const pathToFile = path.join(windowsDir, atRoute, item);
        const stats = await fs.stat(pathToFile);

        if (stats.isDirectory()) {
          await scanDir(path.join(atRoute, item));
          return;
        }

        if (!path.extname(item).endsWith('.tsx')) {
          return;
        }

        const routeToFile =
          item === 'index.tsx'
            ? atRoute
            : path.join(atRoute, item.replace('.tsx', ''));

        if (windowsMap[routeToFile]) {
          throw new RouteDefinedTwiceError(
            routeToFile,
            windowsMap[routeToFile],
            pathToFile,
          );
        }

        windowsMap[routeToFile] = pathToFile;
      }),
    );
  }

  await scanDir('/');

  if (!windowsMap['/']) {
    throw new NoIndexRouteError(windowsDir);
  }

  return windowsMap;
}

export class WindowsDirectoryNotFoundError extends Error {
  name = 'WindowsDirectoryNotFoundError';
  constructor(windowsDir: string) {
    super(`Windows directory not at the expected location: ${windowsDir}`);
  }
}

export class NoIndexRouteError extends Error {
  name = 'NoIndexRouteError';
  constructor(windowsDir: string) {
    super(`No index route found at: ${path.join(windowsDir, 'index.tsx')}`);
  }
}

export class RouteDefinedTwiceError extends Error {
  name = 'RouteDefinedTwiceError';
  constructor(route: string, firstFile: string, secondFile: string) {
    super(`Route ${route} defined twice: ${firstFile} and ${secondFile}`);
  }
}

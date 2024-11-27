import path from 'node:path';
import type { Plugin } from 'vite';

/**
 * This plugin allows you to define virtual files in the project.
 *
 * @param workDir - The working directory of the project, same as the one passed to the config
 * @param virtualFiles - A mapping of virtual file paths to their content
 * @returns A Vite plugin
 */
export const virtualFiles = (
  workDir: string,
  virtualFiles: Record<string, string>,
): Plugin => {
  const absVirtualFiles = Object.fromEntries(
    Object.entries(virtualFiles).map(([id, content]) => [
      path.join(workDir, id),
      content,
    ]),
  );

  return {
    name: '@react-appkit:virtual-files',
    enforce: 'pre',
    resolveId(id, importer) {
      const absId = importer
        ? path.join(path.dirname(importer), id)
        : id.startsWith('./') || id.startsWith('../')
          ? path.join(workDir, id)
          : id;

      if (absId in absVirtualFiles) {
        return absId;
      }
    },
    load(id: string) {
      if (id in absVirtualFiles) {
        return absVirtualFiles[id];
      }
    },
  };
};

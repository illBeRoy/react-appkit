import type { Plugin } from 'vite';
import path from 'node:path';
import babel from '@babel/core';
// @ts-expect-error babel typescript plugin does not have types
import babelTs from '@babel/plugin-transform-typescript';

const ipcModules = [
  /^@react-appkit\/runtime\/main\/api\/.+/,
  /\/src\/actions\/.+/,
];

/**
 * This plugin polyfills the import of main process modules in the renderer process using ipc.
 * In essence, whenever it runs into an "import" or a "require" from a file that runs in the main process (like runtime APIs or actions defined in the `src/actions` directory),
 * it will be replaced with a call to `importIpc`, which returns a Proxy that, when called, invokes the imported module in the main process.
 *
 * @param workDir - The working directory of the project, same as the one passed to the config
 * @returns A Vite plugin
 */
export const ipcImportPolyfill = (workDir: string): Plugin => ({
  name: '@react-appkit:ipc-import-polyfill',
  enforce: 'pre',
  resolveId(id, importer) {
    const absoluteId =
      importer && (id.startsWith('./') || id.startsWith('../'))
        ? path.join(path.dirname(importer), id)
        : id;

    if (ipcModules.some((mod) => mod.test(absoluteId))) {
      return { id: absoluteId, external: true };
    }
  },
  async transform(code, id) {
    const isCodeFile = ['ts', 'tsx', 'js', 'jsx', 'mjs', 'mts'].some((ext) =>
      id.split('?')[0].endsWith(`.${ext}`),
    );

    if (!isCodeFile) {
      return;
    }

    const result = await babel.transformAsync(code, {
      sourceMaps: true,
      plugins: [
        [babelTs, { isTSX: true }],
        {
          visitor: {
            ImportDeclaration(nodePath) {
              if (nodePath.node.importKind === 'type') {
                return;
              }

              const importPath = nodePath.node.source.value;

              const absoluteImportPath =
                importPath.startsWith('./') || importPath.startsWith('../')
                  ? path.join(path.dirname(id), importPath)
                  : importPath;

              const isImportFromIpcModule = ipcModules.some((mod) =>
                mod.test(absoluteImportPath),
              );

              if (!isImportFromIpcModule) {
                return;
              }

              const importedVars: {
                from: '*' | 'default' | (string & {});
                to: string;
              }[] = [];

              nodePath.node.specifiers.forEach((specifier) => {
                switch (specifier.type) {
                  case 'ImportDefaultSpecifier':
                    importedVars.push({
                      from: 'default',
                      to: specifier.local.name,
                    });
                    return;
                  case 'ImportNamespaceSpecifier':
                    importedVars.push({
                      from: '*',
                      to: specifier.local.name,
                    });
                    return;
                  default:
                    if (specifier.importKind === 'value') {
                      importedVars.push({
                        from:
                          specifier.imported.type === 'Identifier'
                            ? specifier.imported.name
                            : specifier.imported.value,
                        to: specifier.local.name,
                      });
                      return;
                    }
                }
              });

              const importPathRelativeToWorkDir = absoluteImportPath.startsWith(
                workDir,
              )
                ? `./${path.relative(workDir, absoluteImportPath)}`
                : absoluteImportPath;

              const polyfilledCode = babel.parse(
                importedVars
                  .map((imp) =>
                    imp.from === '*'
                      ? `var ${imp.to} = importIpc(${JSON.stringify(importPathRelativeToWorkDir)})`
                      : `var ${imp.to} = importIpc(${JSON.stringify(importPathRelativeToWorkDir)}).${imp.from}`,
                  )
                  .join(';\n'),
                {
                  plugins: [babelTs],
                },
              );

              if (polyfilledCode?.program?.body) {
                const declarations = nodePath.replaceInline(
                  polyfilledCode.program.body,
                );
                declarations.forEach((dec) =>
                  nodePath.scope.registerDeclaration(dec),
                );
              } else {
                throw new Error('Failed to create polyfilled code!');
              }
            },
            ExportDeclaration(nodePath) {
              if (nodePath.node.type === 'ExportDefaultDeclaration') {
                return;
              }

              const exportPath = nodePath.node.source?.value;

              if (!exportPath) {
                return;
              }

              const absoluteExportPath =
                exportPath.startsWith('./') || exportPath.startsWith('../')
                  ? path.join(path.dirname(id), exportPath)
                  : exportPath;

              const isExportFromIpcModule = ipcModules.some((mod) =>
                mod.test(absoluteExportPath),
              );

              if (isExportFromIpcModule) {
                throw new Error(
                  `Please refrain from re-exporting the main process!\n` +
                    `  in file: ${id}\n` +
                    `  tried to export: ${exportPath}`,
                );
              }
            },
            CallExpression(nodePath) {
              const isRequire =
                nodePath.node.callee.type === 'Identifier' &&
                nodePath.node.callee.name === 'require';

              if (!isRequire) {
                return;
              }

              const importPath =
                nodePath.node.arguments[0]?.type === 'StringLiteral'
                  ? nodePath.node.arguments[0].value
                  : null;

              if (!importPath) {
                return;
              }

              const absoluteImportPath =
                importPath.startsWith('./') || importPath.startsWith('../')
                  ? path.join(path.dirname(id), importPath)
                  : importPath;

              const isImportFromIpcModule = ipcModules.some((mod) =>
                mod.test(absoluteImportPath),
              );

              if (!isImportFromIpcModule) {
                return;
              }

              const importPathRelativeToWorkDir = absoluteImportPath.startsWith(
                workDir,
              )
                ? `./${path.relative(workDir, absoluteImportPath)}`
                : absoluteImportPath;

              if (nodePath.node.arguments[0]?.type === 'StringLiteral') {
                nodePath.node.arguments[0].value = importPathRelativeToWorkDir;
              }
            },
          },
        },
      ],
    });

    return {
      code: `${result?.code}`,
      map: result?.map,
    };
  },
});

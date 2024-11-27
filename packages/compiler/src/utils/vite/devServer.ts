import type { Plugin } from 'vite';
import babel from '@babel/core';
import babelTs from '@babel/plugin-transform-typescript';
import { templateFile } from '../templateFile';

export const devServer = (): Plugin => {
  const importPolyfillJs = babel.transformFileSync(
    require.resolve('@react-appkit/runtime/renderer/ipcRequirePolyfill'),
    {
      plugins: [
        babelTs,
        {
          visitor: {
            ExportDeclaration(path) {
              path.remove();
            },
          },
        },
      ],
    },
  );
  if (!importPolyfillJs?.code) {
    throw new Error('Failed to transform "importPolyfill.js"');
  }

  return {
    name: '@react-appkit:dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        switch (req.url) {
          case '/': {
            const htmlTemplate = templateFile('renderer/index.html');
            const html = await server.transformIndexHtml('/', htmlTemplate);
            return res.end(html);
          }
          case '/importPolyfill.js': {
            return res.end(importPolyfillJs.code);
          }
          default: {
            return next();
          }
        }
      });
    },
  };
};

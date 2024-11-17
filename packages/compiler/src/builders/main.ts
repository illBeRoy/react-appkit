import path from 'node:path';
import * as vite from 'vite';
import { externalizeMainProcessDeps, virtualFiles } from '../utils/vite';
import { templateFile } from '../utils/templateFile';

export const mainBuilder = (workDir: string) => {
  const baseCfg: vite.InlineConfig = {
    root: workDir,
    plugins: [
      virtualFiles({
        [path.join(workDir, 'entrypoint.ts')]:
          templateFile('main/entrypoint.ts'),
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
  };

  async function buildForProduction() {
    const buildCfg = vite.mergeConfig(baseCfg, { mode: 'production' });
    await vite.build(buildCfg);
  }

  async function createDevServer(
    port: number,
    opts: {
      rendererDevServerUrl: string;
    },
  ) {
    const hmrCfg: vite.InlineConfig = {
      server: {
        port,
      },
      define: {
        __REACT_APPKIT_RENDERER_DEV_SERVER_URL: JSON.stringify(
          opts.rendererDevServerUrl,
        ),
      },
    };

    const devCfg = vite.mergeConfig(baseCfg, hmrCfg);

    await vite.build(devCfg);
    // return vite.createServer(devCfg);
  }

  return { buildForProduction, createDevServer };
};

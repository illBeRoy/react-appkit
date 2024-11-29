import path from 'node:path';
import * as vite from 'vite';
import { externalizeMainProcessDeps } from '../utils/vite/externalizeMainProcessDeps';
import { virtualFiles } from '../utils/vite/virtualFiles';
import { templateDir } from '../utils/template';

export const mainBuilder = (workDir: string) => {
  const baseCfg: vite.InlineConfig = {
    root: workDir,
    configFile: false,
    logLevel: 'silent',
    plugins: [
      virtualFiles(workDir, templateDir('main')),
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
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].chunk.js',
        },
      },
    },
  };

  async function buildForProduction() {
    const buildCfg = vite.mergeConfig(baseCfg, { mode: 'production' });
    await vite.build(buildCfg);
  }

  async function buildAndWatch(opts: {
    rendererDevServerUrl: string;
  }): Promise<vite.Rollup.RollupWatcher> {
    const hmrCfg: vite.InlineConfig = {
      mode: 'development',
      build: {
        watch: {
          buildDelay: 100,
        },
      },
      define: {
        __REACT_APPKIT_RENDERER_DEV_SERVER_URL: JSON.stringify(
          opts.rendererDevServerUrl,
        ),
        __HMR_FILES_BASE_PATH: JSON.stringify(
          path.join(workDir, 'dist', 'main'),
        ),
      },
    };

    const devCfg = vite.mergeConfig(baseCfg, hmrCfg);

    const watcher = (await vite.build(devCfg)) as vite.Rollup.RollupWatcher;

    return new Promise((resolve) => {
      function onBundleReady(e: vite.Rollup.RollupWatcherEvent) {
        if (e.code === 'BUNDLE_END') {
          watcher.off('event', onBundleReady);
          resolve(watcher);
        }
      }

      watcher.on('event', onBundleReady);
    });
  }

  return { buildForProduction, buildAndWatch };
};

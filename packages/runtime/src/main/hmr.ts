import type { AppRuntimeOptions } from './app';
import fs from 'node:fs/promises';

export interface HmrOptions {
  userActionsFile: string;
}

export const startHmr = (
  opts: HmrOptions,
  handlers: {
    onActionsChanged: (
      newActions: Exclude<AppRuntimeOptions['userActions'], undefined>,
    ) => void;
  },
) => {
  const actionsWatcher = startWatchingFile(opts.userActionsFile, () => {
    delete require.cache[require.resolve(opts.userActionsFile)];
    const newActions = require(opts.userActionsFile).userActions; // eslint-disable-line @typescript-eslint/no-require-imports
    handlers.onActionsChanged(newActions);
  });

  function stop() {
    actionsWatcher.stop();
  }

  return { stop };
};

const startWatchingFile = (path: string, onChange: () => void) => {
  let lastUpdated = Date.now();

  async function poll() {
    const stat = await fs.stat(path).catch(() => 'not found' as const);

    if (stat === 'not found') {
      return;
    }

    if (stat.mtimeMs > lastUpdated) {
      lastUpdated = stat.mtimeMs;
      onChange();
    }
  }

  const pollInterval = setInterval(poll, 1000);

  function stop() {
    clearInterval(pollInterval);
  }

  return { stop };
};

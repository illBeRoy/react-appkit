import fs from 'node:fs/promises';

export const startHmrOnModule = (
  file: string,
  handler: (updatedModule: Record<string, unknown>) => void,
) => {
  const watcher = watchFile(file, () => {
    delete require.cache[require.resolve(file)];
    const newModule = require(file); // eslint-disable-line @typescript-eslint/no-require-imports
    handler(newModule);
  });

  return { stop: watcher.stop };
};

const watchFile = (path: string, onChange: () => void) => {
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

import fs from 'fs/promises';
import path from 'path';
import semver from 'semver';

export const NotPublished = Symbol('NotPublished');

export const getVersion = async (
  packageName: string,
  major: number,
): Promise<string | typeof NotPublished> => {
  const process = Bun.spawn({
    cmd: ['npm', 'view', `${packageName}@${major}`, 'version', '--json'],
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  await process.exited;

  if (process.exitCode !== 0) {
    return NotPublished;
  }

  const results = JSON.parse(await new Response(process.stdout).text());

  if (typeof results === 'string') {
    return results;
  }

  return [...results].sort((a, b) => semver.compare(a, b)).pop();
};

export const publish = async (dir: string) => {
  await fs.writeFile(
    path.join(dir, '.npmrc'),
    process.env.npm_config_registry
      ?.replace('http://', '//')
      .replace('https://', '//') + '/:_authToken=${NPM_TOKEN}',
  );

  const p = Bun.spawn({
    cmd: ['npm', 'publish', '--access', 'public'],
    stdio: ['inherit', 'inherit', 'inherit'],
    cwd: dir,
  });

  await p.exited;

  if (p.exitCode !== 0) {
    throw new Error(`Failed to publish package (at ${dir})`);
  }
};

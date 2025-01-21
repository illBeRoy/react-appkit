import fs from 'node:fs/promises';
import path from 'node:path';
import semver from 'semver';
import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import { globby } from 'globby';
import { getVersion, NotPublished, publish } from './utils/npm';

console.log(chalk.bold.bgWhite(' Preparing to release packages... '));
console.log();
console.log(
  'NPM Registry:',
  chalk.blueBright.underline(
    process.env.npm_config_registry ?? 'https://registry.npmjs.org',
  ),
);
console.log();

// find monorepo root
const monorepoRoot = path.join(__dirname, '..', '..', '..');

// get root package.json
const rootPackageJson = await fs
  .readFile(path.join(monorepoRoot, 'package.json'), 'utf8')
  .then(JSON.parse);

// list all packages
const packagesDir = path.join(monorepoRoot, 'packages');
const allPackageDirs = await fs.readdir(packagesDir);
const allPackages = await Promise.all(
  allPackageDirs.map(async (dir) => {
    const packageJsonPath = path.join(packagesDir, dir, 'package.json');
    const packageJson = await fs.readFile(packageJsonPath, 'utf8');
    const pkgJson = JSON.parse(packageJson);
    const majorVersion = semver.major(pkgJson.version);
    return {
      pkgName: pkgJson.name,
      majorVersion,
      publishable: !pkgJson.private,
      files: (pkgJson.files as string[]) ?? [],
      dir: path.join(packagesDir, dir),
    };
  }),
);

console.log(chalk.bold.underline('Packages:'));
allPackages
  .toSorted((a, b) => (b.publishable && !a.publishable ? 1 : -1))
  .forEach((pkg) => {
    console.log(
      pkg.publishable ? chalk.cyan(pkg.pkgName) : chalk.gray(pkg.pkgName),
      pkg.publishable
        ? chalk.bold(`v${pkg.majorVersion}`)
        : chalk.gray(`v${pkg.majorVersion}`),
      pkg.publishable ? chalk.green('[Public]') : chalk.grey('[Private]'),
    );
  });
console.log();

// ensure all packages same major
const allPublishablePackages = allPackages.filter((pkg) => pkg.publishable);
const majorVersion = allPublishablePackages[0].majorVersion;
const allPkgsSameMajor = allPublishablePackages.every(
  (pkg) => pkg.majorVersion === majorVersion,
);

if (!allPkgsSameMajor) {
  console.log(
    chalk.bold.bgRed(' Error '),
    'All public packages must have the same major version, as they are published together',
  );
  process.exit(1);
}

const nextVersionLoader = ora('Determining next version to publish...').start();
const allVersions = await Promise.all(
  allPublishablePackages.map((pkg) => getVersion(pkg.pkgName, majorVersion)),
);
const latestVersion = allVersions.reduce((a, b) => {
  if (a === NotPublished) {
    return b;
  }

  if (b === NotPublished) {
    return a;
  }

  return semver.gt(a, b) ? a : b;
}, NotPublished);

const nextVersion =
  latestVersion === NotPublished
    ? `${majorVersion}.0.0`
    : semver.inc(latestVersion, 'patch')!;

nextVersionLoader.succeed(
  `Version to be published: ${chalk.green.bold(nextVersion)}`,
);
console.log();

// Ensure user wants to publish
const confirm = await prompts({
  type: 'confirm',
  name: 'confirm',
  message: 'Are you sure you want to publish these packages?',
});

if (!confirm.confirm) {
  console.log();
  console.log(chalk.bold.bgGray(' Aborted '), 'Release cancelled by user.');
  process.exit(0);
}

// Create temp directory
const tmpDir = path.join('.release', `${nextVersion}`);
await fs.rm(tmpDir, { recursive: true, force: true });
await fs.mkdir(tmpDir, { recursive: true });

// Copy all packages
await Promise.all(
  allPublishablePackages.map(async (pkg) => {
    const publishableDir = path.join(tmpDir, path.basename(pkg.dir));

    // copy package.json
    await fs.mkdir(publishableDir, { recursive: true });
    await fs.copyFile(
      path.join(pkg.dir, 'package.json'),
      path.join(publishableDir, 'package.json'),
    );

    // copy files
    const files = await globby(pkg.files, { cwd: pkg.dir });
    await Promise.all(
      files.map(async (file) => {
        await fs.cp(path.join(pkg.dir, file), path.join(publishableDir, file), {
          recursive: true,
        });
      }),
    );

    // update package.json details
    const pkgJson = await fs
      .readFile(path.join(publishableDir, 'package.json'), 'utf8')
      .then(JSON.parse);

    pkgJson.version = nextVersion;
    pkgJson.homepage = rootPackageJson.homepage;
    pkgJson.repository = rootPackageJson.repository;

    // update workspace dependencies to point to major version instead of workspace
    for (const depsMap of [
      pkgJson.dependencies ?? {},
      pkgJson.devDependencies ?? {},
    ]) {
      for (const [dep, version] of Object.entries(depsMap)) {
        if (typeof version === 'string' && version.startsWith('workspace:')) {
          if (!allPublishablePackages.some((p) => p.pkgName === dep)) {
            throw new Error(
              `Package "${dep}" is workspace a dependency of ${pkg.pkgName}, but is not publishable (probably set as "private")`,
            );
          }
          depsMap[dep] =
            `^${semver.major(nextVersion)}.${semver.minor(nextVersion)}.0`;
        }
      }
    }

    await fs.writeFile(
      path.join(publishableDir, 'package.json'),
      JSON.stringify(pkgJson, null, 2),
    );

    // publish
    await publish(publishableDir);
    console.log(chalk.bold.bgGreen(' Published '), chalk.cyan(pkg.pkgName));
  }),
);

import ora from 'ora';
import prompts from 'prompts';
import path from 'path';
import { createAppDirectory } from './createAppDirectory';
import chalk from 'chalk';

async function main() {
  console.log();
  console.log(
    `${chalk.gray('Welcome to ')}${chalk.red('●')}${chalk.yellow('●')}${chalk.green('●')} ${chalk.bold('React AppKit')}${chalk.gray('!')}`,
  );
  console.log(
    "In just a few minutes, you'll be ready to start building your new desktop app.",
  );
  console.log();

  const { displayName } = await prompts({
    type: 'text',
    name: 'displayName',
    message: `What is the ${chalk.bold.yellow('display name')} of your app?`,
    validate: (value) =>
      value.length < 3 ? 'App name must be at least 3 characters long' : true,
  });

  if (!displayName) {
    console.log(chalk.bold.bgGray(' Aborted '), 'Cancelled by user.');
    process.exit(1);
  }

  const { appId } = await prompts({
    type: 'text',
    name: 'appId',
    message: `What is the ${chalk.bold.yellow('app id')}?`,
    initial: `com.example.${displayName.toLowerCase().replace(/ /g, '-')}`,
    validate: (value: string) =>
      value.endsWith('.')
        ? 'App ID must not end with a dot'
        : value.toLowerCase() !== value
          ? 'App ID must be lowercase'
          : value.includes(' ')
            ? 'App ID must not contain spaces'
            : true,
  });

  if (!appId) {
    console.log(chalk.bold.bgGray(' Aborted '), 'Cancelled by user.');
    process.exit(1);
  }

  const { packageName } = await prompts({
    type: 'text',
    name: 'packageName',
    message: `What is the ${chalk.bold.yellow('package name')} (to be used in the package.json)?`,
    initial: displayName.toLowerCase().replace(/ /g, '-'),
  });

  if (!packageName) {
    console.log(chalk.bold.bgGray(' Aborted '), 'Cancelled by user.');
    process.exit(1);
  }

  const { pkgManager } = await prompts({
    type: 'select',
    name: 'pkgManager',
    message: `Which ${chalk.bold.yellow('package manager')} should we use to install dependencies?`,
    choices: [
      { title: 'npm', value: 'npm' },
      { title: 'yarn', value: 'yarn' },
      { title: 'pnpm', value: 'pnpm' },
      { title: 'bun', value: 'bun' },
    ],
  });

  if (!pkgManager) {
    console.log(chalk.bold.bgGray(' Aborted '), 'Cancelled by user.');
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), packageName.split('/').pop()!);

  const { confirmCreation } = await prompts({
    type: 'confirm',
    name: 'confirmCreation',
    message: `App will be created in ${chalk.cyan(targetDir)}. Continue?`,
    initial: 'true',
  });

  if (!confirmCreation) {
    console.log(chalk.bold.bgGray(' Aborted '), 'Cancelled by user.');
    process.exit(1);
  }

  const loader = ora('Creating project and installing dependencies...').start();

  try {
    await createAppDirectory({
      atDir: targetDir,
      params: {
        appName: displayName,
        appId,
        packageName,
      },
      pkgManager,
    });
    loader.succeed('Project created and dependencies were installed');
  } catch (err) {
    loader.fail('Failed to create app');
    console.error(err);
  }

  console.log(chalk.bgGreen(' Success '), 'App created successfully!');
  console.log(chalk.bold('Next steps:'));
  console.log(
    '  1. Open your project dir:',
    chalk.bgGray(
      ` ${chalk.bold('cd')} ${chalk.underline.bold.cyan(targetDir)} `,
    ),
  );
  console.log(
    '  2. Start the development environment:',
    chalk.bgGray(` ${pkgManager} run dev `),
  );
  console.log('  3. Get to coding!');
  console.log();
  console.log(
    'Learn more about React AppKit at ',
    chalk.underline.bold.cyan('https://github.com/illBeRoy/react-appkit'),
  );
}

main();

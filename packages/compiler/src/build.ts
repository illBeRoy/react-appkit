#!/usr/bin/env node
import ora from 'ora';
import chalk from 'chalk';
import { buildAllForProduction } from './builders';
import { assertAppConfigExists } from './utils/config';

export async function build(workDir: string) {
  const status = ora().start();

  status.text = 'Validating app config...';
  await assertAppConfigExists(workDir);

  status.text = 'Building app...';
  await buildAllForProduction(workDir);

  status.succeed(
    chalk.green('App built successfully! 🎉\n\n') +
      'You can now run the following commands:\n' +
      `  • ${chalk.inverse.italic('  start  ')} to ${chalk.bold.blueBright(
        'launch the app',
      )}\n` +
      `  • ${chalk.inverse.italic('  pack   ')} to ${chalk.bold.blueBright(
        'package the app for distribution',
      )}\n`,
  );
}

if (require.main === module) {
  build(process.cwd()).catch((error) => {
    console.error(
      error instanceof Error ? `[${error.name}] ${error.message}` : error,
    );
    process.exit(1);
  });
}

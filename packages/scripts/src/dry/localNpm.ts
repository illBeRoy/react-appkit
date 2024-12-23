const verdaccio = Bun.spawn({
  cmd: [
    'docker',
    'run',
    '-p',
    '4873:4873',
    '-v',
    `${process.cwd()}/src/dry/conf:/verdaccio/conf`,
    'verdaccio/verdaccio',
  ],
  stdio: ['inherit', 'inherit', 'inherit'],
});

await verdaccio.exited;

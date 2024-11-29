let ApplicationMenuComponent: React.ComponentType | undefined;

const maybeMenuModule = import.meta.glob('./src/menu.tsx', { eager: true });
if (maybeMenuModule?.['./src/menu.tsx']) {
  const menuModule = maybeMenuModule['./src/menu.tsx'];

  if (
    !menuModule ||
    typeof menuModule !== 'object' ||
    !('default' in menuModule)
  ) {
    throw new Error(
      'The ./src/menu.tsx file must export a default component that contains the <ApplicationMenu /> component.',
    );
  }

  ApplicationMenuComponent = menuModule.default as React.ComponentType;
}

export { ApplicationMenuComponent };

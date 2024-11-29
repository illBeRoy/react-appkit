let TrayComponent: React.ComponentType | undefined;

const maybeTrayModule = import.meta.glob('./src/tray.tsx', { eager: true });
if (maybeTrayModule?.['./src/tray.tsx']) {
  const trayModule = maybeTrayModule['./src/tray.tsx'];

  if (
    !trayModule ||
    typeof trayModule !== 'object' ||
    !('default' in trayModule)
  ) {
    throw new Error(
      'The ./src/tray.tsx file must export a default component that contains the <Tray /> component.',
    );
  }

  TrayComponent = trayModule.default as React.ComponentType;
}

export { TrayComponent };

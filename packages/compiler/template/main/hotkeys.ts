let hotkeys: Map<string, () => void | Promise<void>> = new Map();

const maybeHotkeysModule = import.meta.glob('./src/hotkeys.ts', {
  eager: true,
});

if (maybeHotkeysModule?.['./src/hotkeys.ts']) {
  const hotkeysModule = maybeHotkeysModule['./src/hotkeys.ts'];

  if (
    !hotkeysModule ||
    typeof hotkeysModule !== 'object' ||
    !('default' in hotkeysModule) ||
    !hotkeysModule.default ||
    typeof hotkeysModule.default !== 'object' ||
    !('build' in hotkeysModule.default) ||
    typeof hotkeysModule.default.build !== 'function'
  ) {
    throw new Error(
      'The ./src/hotkeys.ts file must export a hotkeys builder. Example:\n\nimport { hotkeys } from "@react-appkit/sdk/hotkeys";\n\nexport default hotkeys()\n  .addHotkey(["CmdOrCtrl", "H"], () => console.log("Hello, world"));\n',
    );
  }

  hotkeys = hotkeysModule.default.build();
}

export { hotkeys };

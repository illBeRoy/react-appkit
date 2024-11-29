import type { Key } from '@react-appkit/runtime/main/hotkeys/key';

class HotkeysBuilder {
  private readonly hotkeyHandlers: Map<string, () => void | Promise<void>> =
    new Map();

  addHotkey(hotkey: [Key, ...Key[]], handler: () => void | Promise<void>) {
    this.hotkeyHandlers.set(hotkey.join('+'), handler);
    return this;
  }

  build() {
    return this.hotkeyHandlers;
  }
}

export const hotkeys = () => new HotkeysBuilder();

export type { HotkeysBuilder };

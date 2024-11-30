/**
 * @module hotkeys
 * APIs to define global hotkeys in the app.
 * Use this in the "src/hotkeys.ts" file to register hotkeys that can be used even if the app is not focused.
 */

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

/**
 * Creates and registers global hotkeys.
 * Use in the "src/hotkeys.ts" file to register hotkeys that can be used even if the app is not focused.
 * @returns A hotkeys configuration builder.
 * @example
 * ```ts
 * import { hotkeys } from '@react-appkit/sdk/hotkeys';
 *
 * export default hotkeys().addHotkey(['CmdOrCtrl', 'H'], () => {
 *   console.log('Hotkey pressed!');
 * });
 * ```
 */
export const hotkeys = () => new HotkeysBuilder();

export type { HotkeysBuilder };

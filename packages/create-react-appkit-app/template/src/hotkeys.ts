/**
 * The src/hotkeys.ts file is used to create global hotkeys.
 * This is useful for creating shortcuts that can be used to perform actions in your app even when the app is not focused.
 *
 * In order to use a hotkey, you must first import the hotkeys function from the @react-appkit/sdk/hotkeys package.
 * Then, you can use the addHotkey method to add a hotkey (they can be chained).
 * The first argument is an array of keys that will trigger the hotkey.
 * The second argument is a function that will be called when the hotkey is triggered.
 *
 * If you don't need hotkeys, you can delete this file.
 */
import { alert } from '@react-appkit/sdk/dialog';
import { hotkeys } from '@react-appkit/sdk/hotkeys';

export default hotkeys().addHotkey(['CmdOrCtrl', 'Shift', 'R'], () => {
  alert('Hello from React AppKit!');
});

import { hotkeys } from '@react-appkit/sdk/hotkeys';

export default hotkeys().addHotkey(['CmdOrCtrl', 'U'], () => {
  console.log('Hi from hotkeys');
});

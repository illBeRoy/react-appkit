/**
 * The src/menu.tsx file is responsible for creating the application menu.
 * This menu is a fully customizable React component with support for all of React's APIs.
 * On Windows and Linux, it appears in the top corner of the window (though you can disable it for specific windows by configuring the Window component).
 * On macOS, it is located in the top left corner of the screen.
 *
 * If you find that you don't need a menu, you can delete this file.
 */
import { ApplicationMenu, Menu, MenuItem } from '@react-appkit/sdk/menu';
import { alert } from '@react-appkit/sdk/dialog';
import { quit } from '@react-appkit/sdk/app';

export default function AppMenu() {
  return (
    <ApplicationMenu>
      <Menu title="File" isMacAppMenu>
        <MenuItem.Button
          label="About"
          onClick={() => alert('This is an example app')}
        />
        <MenuItem.Button label="Quit" onClick={() => quit()} />
      </Menu>
    </ApplicationMenu>
  );
}

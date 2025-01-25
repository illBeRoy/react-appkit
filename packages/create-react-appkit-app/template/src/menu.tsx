/**
 * The src/menu.tsx file is responsible for creating the application menu.
 * This menu is a fully customizable React component with support for all of React's APIs.
 * On Windows and Linux, it appears in the top corner of the window (though you can disable it for specific windows by configuring the Window component).
 * On macOS, it is located in the top left corner of the screen.
 *
 * If you find that you don't need a menu, you can delete this file.
 */
import { ApplicationMenu, Menu, MenuItem } from '@react-appkit/sdk/menu';
import { createNewWindow } from '@react-appkit/sdk/window';
import { quit } from '@react-appkit/sdk/app';
import { useGlobalState } from '@react-appkit/sdk/global';
import { openTextFile, saveTextFile } from './actions/file';

export default function AppMenu() {
  const [text, setText] = useGlobalState<string | null>('text', null);

  return (
    <ApplicationMenu>
      <Menu title="File">
        <MenuItem.Button label="New" onClick={() => setText('')} />
        <MenuItem.Button
          label="Open"
          onClick={async () => {
            const text = await openTextFile();
            if (text !== null) {
              setText(text);
            }
          }}
        />
        <MenuItem.Button
          label="Save"
          onClick={async () => {
            if (text !== null) {
              await saveTextFile(text);
            }
          }}
        />
        <MenuItem.Separator />
        <MenuItem.Button
          label="Learn More"
          onClick={() =>
            createNewWindow('/learnMore', { channel: 'secondaryWindow' })
          }
        />
        <MenuItem.Separator />
        <MenuItem.Button label="Quit" onClick={() => quit()} />
      </Menu>
    </ApplicationMenu>
  );
}

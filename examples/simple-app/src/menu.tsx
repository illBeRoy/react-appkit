import { ApplicationMenu, Menu, MenuItem } from '@react-appkit/sdk/menu';

export default function AppMenu() {
  return (
    <ApplicationMenu>
      <Menu title="File" isMacAppMenu>
        <MenuItem.Button label="New" />
        <MenuItem.Button label="Open" />
        <MenuItem.Button label="Save" enabled={false} />
      </Menu>
      <Menu title="Edit">
        <MenuItem.Button label="Undo" />
        <MenuItem.Button label="Redo" />
      </Menu>
      <Menu title="Window">
        <MenuItem.Button label="Minimize" />
        <MenuItem.Button label="Zoom" />
      </Menu>
    </ApplicationMenu>
  );
}

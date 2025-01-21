/*
 * The src/tray.tsx file is used to create a tray icon and menu for your application.
 * On Windows and Linux, this icon appears in the system tray.
 * On macOS, it shows up in the top left corner of the screen.
 *
 * When creating a Tray component, you must provide an image, which you can import like any other asset.
 * The image will be automatically adjusted and resized to meet the system's requirements.
 *
 * If you don't need a tray icon, feel free to delete this file.
 */
import { Tray, TrayMenu, TrayMenuItem } from '@react-appkit/sdk/tray';
import { quit } from '@react-appkit/sdk/app';
import glyphPng from './assets/glyph.png';

export default function ApplicationTray() {
  return (
    <Tray icon={glyphPng}>
      <TrayMenu>
        <TrayMenuItem.Button label="[[APP_NAME]]" enabled={false} />
        <TrayMenuItem.Separator />
        <TrayMenuItem.Button label="Quit" onClick={() => quit()} />
      </TrayMenu>
    </Tray>
  );
}

import { Tray, TrayMenu, TrayMenuItem } from '@react-appkit/sdk/tray';
import imagePng from './assets/image.png';

export default function ApplicationTray() {
  return (
    <Tray icon={imagePng}>
      <TrayMenu>
        <TrayMenuItem.Button label="Quit" onClick={() => {}} />
      </TrayMenu>
    </Tray>
  );
}

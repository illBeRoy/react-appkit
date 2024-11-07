import { Tray, TrayMenu, TrayMenuItem } from '@react-appkit/sdk/tray';
import glyphPng from './assets/glyph.png';
import { quit } from '@react-appkit/sdk/app';
import { useEffect, useState } from 'react';

export default function ApplicationTray() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <Tray icon={glyphPng}>
      <TrayMenu>
        <TrayMenuItem.Button label="Example App" enabled={false} />
        <TrayMenuItem.Button label={`Count: ${count}`} enabled={false} />
        <TrayMenuItem.Separator />
        <TrayMenuItem.Button label="Quit" onClick={() => quit()} />
      </TrayMenu>
    </Tray>
  );
}

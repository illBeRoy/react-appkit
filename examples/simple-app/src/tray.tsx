import { useState } from 'react';
import { Tray, TrayMenu, TrayMenuItem } from '@react-appkit/sdk/tray';
import { quit } from '@react-appkit/sdk/app';
import { useGlobalState } from '@react-appkit/sdk/global';
import glyphPng from './assets/glyph.png';

export default function ApplicationTray() {
  const [checked, setChecked] = useState(false);
  const [option, setOption] = useState(0);
  const [counter, setCounter] = useGlobalState('counter', () => 0);

  return (
    <Tray icon={glyphPng}>
      <TrayMenu>
        <TrayMenuItem.Button
          label="Simple App | By Roy Sommer"
          enabled={false}
        />
        <TrayMenuItem.Separator />
        <TrayMenuItem.Button
          label={`Counter: ${counter}`}
          onClick={() => setCounter(counter + 1)}
        />
        <TrayMenuItem.Checkbox
          label="Check Me"
          checked={checked}
          onClick={() => setChecked((prev) => !prev)}
        />
        <TrayMenu label="Options">
          <TrayMenuItem.Radio
            label="Option 1"
            checked={option === 0}
            onClick={() => setOption(0)}
          />
          <TrayMenuItem.Radio
            label="Option 2"
            checked={option === 1}
            onClick={() => setOption(1)}
          />
          <TrayMenuItem.Radio
            label="Option 3"
            checked={option === 2}
            onClick={() => setOption(2)}
          />
        </TrayMenu>
        <TrayMenuItem.Button label="Quit" onClick={() => quit()} />
      </TrayMenu>
    </Tray>
  );
}

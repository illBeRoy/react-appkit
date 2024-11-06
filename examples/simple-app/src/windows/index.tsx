import { useState } from 'react';
import { Link, useNavigation } from '@react-appkit/sdk/routing';
import {
  closeWindow,
  Window,
  type WindowHandler,
} from '@react-appkit/sdk/window';
import { quit } from '@react-appkit/sdk/app';
import { helloWorld, iThrow } from '../actions/hello';
import styles from './index.module.css';

export default function IndexWindow() {
  const [popupWindow, setPopupWindow] = useState<WindowHandler | null>(null);
  const navigation = useNavigation();

  return (
    <>
      <Window>
        <Window.Title>Simple App</Window.Title>
        <Window.Size width={300} height={300} />
        <Window.Position x="50%" y="50%" origin="center" />
      </Window>
      <div className={styles.body}>
        <div>This is index!</div>
        <Link to="/about">About</Link>
        <br />
        <button
          onClick={() => {
            helloWorld().then((res) => alert(res));
          }}
        >
          Action: Hello
        </button>
        <button
          onClick={() => {
            iThrow().catch(console.error);
          }}
        >
          Action iThrowError
        </button>
        <button
          onClick={async () => {
            const win = await navigation.popup('/popup');
            setPopupWindow(win);
          }}
        >
          Open Popup
        </button>
        <button
          onClick={async () => {
            if (popupWindow) {
              await closeWindow(popupWindow);
              setPopupWindow(null);
            }
          }}
        >
          Close Popup
        </button>
        <button onClick={() => quit()}>Close app</button>
      </div>
    </>
  );
}

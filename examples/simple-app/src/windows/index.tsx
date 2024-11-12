import { Link, useNavigation } from '@react-appkit/sdk/routing';
import { env, quit } from '@react-appkit/sdk/app';
import { alert } from '@react-appkit/sdk/dialog';
import { helloWorld, iThrow, selectAndReadAFile } from '../actions/hello';
import styles from './index.module.css';

export default function IndexWindow() {
  const navigation = useNavigation();

  return (
    <div className={styles.body}>
      <div>This is index!</div>
      <Link to="/about">About</Link>
      <br />
      <button
        onClick={() => {
          helloWorld('Roy').then((res) => alert(res));
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
        onClick={() => {
          selectAndReadAFile().then((res) =>
            alert(res, { skin: 'info', buttons: ['Coolio'] }),
          );
        }}
      >
        Action: Select and read a file
      </button>
      <button
        onClick={async () => {
          const envVal = await env('FOO');
          alert(envVal);
        }}
      >
        Get env var
      </button>
      <button
        onClick={async () => {
          await navigation.popup('/popup', { target: 'popup' });
        }}
      >
        Open Popup
      </button>
      <button
        onClick={async () => {
          await navigation.close({ target: 'popup' });
        }}
      >
        Close Popup
      </button>
      <button onClick={() => navigation.popup('/counter')}>
        Open a counter window
      </button>
      <button onClick={() => quit()}>Close app</button>
    </div>
  );
}

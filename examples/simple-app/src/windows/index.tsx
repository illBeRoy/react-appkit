import { Link } from '@react-appkit/sdk/routing';
import { Window } from '@react-appkit/sdk/window';
import { quit } from '@react-appkit/sdk/app';
import { helloWorld } from '../actions/hello';
import styles from './index.module.css';

export default function IndexWindow() {
  return (
    <>
      <Window>
        <Window.Title>Simple App</Window.Title>
        <Window.Size width={300} height={300} />
        <Window.Position x="50%" y="50%" origin="center" />
      </Window>
      <div className={styles.body}>
        <div>This is index!</div>
        <Link to="/about" popup>
          About
        </Link>
        <br />
        <button
          onClick={() => {
            helloWorld().then((res) => alert(res));
          }}
        >
          Hello
        </button>
        <button onClick={() => quit()}>Close app</button>
      </div>
    </>
  );
}

import { useEffect } from 'react';
import { useGlobalState } from '@react-appkit/sdk/global';
import { openTextFile, saveTextFile } from '../actions/file';
import logoPng from '../assets/logo.png';
import styles from './index.module.css';

const defaultText =
  'This text is stored in a global state, utilizing the useGlobalState hook.\n' +
  'The hook offers a similar interface to useState, but the state is shared among all windows and processes of the app.\n' +
  'You can check out the Tray component to see how it uses the same state, and look at the "file" actions to observe them employing the imperative API to access the global state.';

export default function IndexWindow() {
  const [text, setText] = useGlobalState<string | null>('text', null);

  useEffect(() => {
    const handleSave = (e: KeyboardEvent) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey) && text !== null) {
        saveTextFile(text);
      }
    };

    window.addEventListener('keydown', handleSave);

    return () => {
      window.removeEventListener('keydown', handleSave);
    };
  }, [text]);

  if (text === null) {
    return (
      <div className={`${styles.body} ${styles.bodyWithGap}`}>
        <img src={logoPng} alt="logo" className={styles.logo} />
        <span className={styles.explanation}>
          Welcome to your example React Appkit App! This app is a simple text
          editor that allows you to open and edit text files.
          <br />
          <br />
          Get started by{' '}
          <a
            href="#"
            onClick={async () => {
              const text = await openTextFile();
              if (text !== null) {
                setText(text);
              }
            }}
          >
            opening a file
          </a>{' '}
          or{' '}
          <a href="#" onClick={() => setText(defaultText)}>
            creating a new one
          </a>
          .
        </span>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        className={styles.textarea}
        placeholder="Type something..."
      />
      <div className={styles.bottomBar}>
        <div>{text.length}</div>
      </div>
    </div>
  );
}

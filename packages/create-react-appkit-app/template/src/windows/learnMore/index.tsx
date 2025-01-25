import { useNavigation } from '@react-appkit/sdk/routing';
import styles from './index.module.css';

export default function AboutWindow() {
  const router = useNavigation();

  return (
    <div className={styles.body}>
      <h1 className={styles.title}>This is a secondary window</h1>
      <span>
        You can open them using the &quot;createNewWindow&quot; API, or
        preferably, by using the built-in Link element and navigation hook.
      </span>
      <button className={styles.button} onClick={() => router.close()}>
        Close
      </button>
    </div>
  );
}

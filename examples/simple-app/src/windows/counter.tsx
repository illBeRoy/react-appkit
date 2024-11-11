import { useGlobalState } from '@react-appkit/sdk/global';
import { useNavigation } from '@react-appkit/sdk/routing';

export default function CounterWindow() {
  const [counter, setCounter] = useGlobalState('counter', () => 0);
  const navigation = useNavigation();

  return (
    <div>
      <div>This is a counter!</div>
      <div>current: {counter}</div>
      <button onClick={() => setCounter(counter + 1)}>Plus 1</button>
      <button onClick={() => navigation.close()}>Close</button>
    </div>
  );
}

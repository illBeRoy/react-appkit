import { closeWindow } from '@react-appkit/sdk/window';
import { useGlobalState } from '@react-appkit/sdk/global';

export default function CounterWindow() {
  const [counter, setCounter] = useGlobalState('counter', () => 0);

  return (
    <div>
      <div>This is a counter!</div>
      <div>current: {counter}</div>
      <button onClick={() => setCounter(counter + 1)}>Plus 1</button>
      <button onClick={() => closeWindow()}>Close</button>
    </div>
  );
}

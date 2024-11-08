import { closeWindow, Window } from '@react-appkit/sdk/window';
import { useGlobalState } from '@react-appkit/sdk/global';

export default function CounterWindow() {
  const [counter, setCounter] = useGlobalState('counter', () => 0);

  return (
    <>
      <Window>
        <Window.Title>Counter</Window.Title>
        <Window.Resizable resizable={false} />
        <Window.Size width={200} height={200} />
        <Window.Position x={'50%'} y={'50%'} origin="center" />
      </Window>
      <div>
        <div>This is a counter!</div>
        <div>current: {counter}</div>
        <button onClick={() => setCounter(counter + 1)}>Plus 1</button>
        <button onClick={() => closeWindow()}>Close</button>
      </div>
    </>
  );
}

import { Window } from '@react-appkit/sdk/window';
import { useNavigation } from '@react-appkit/sdk/routing';

export default function PopupWindow() {
  const navigation = useNavigation();

  return (
    <>
      <Window>
        <Window.Title maximizable={false} minimizable={false}>
          Popup
        </Window.Title>
        <Window.Size width={300} height={200} />
        <Window.Position x="50%" y="50%" origin="center" />
        <Window.Resizable resizable={false} />
        <Window.AlwaysOnTop />
      </Window>
      <div>
        This is popup! Important things go here.
        <br />
        <button onClick={() => navigation.close()}>Close popup</button>
      </div>
    </>
  );
}

import { closeWindow, Window } from '@react-appkit/sdk/window';

export default function PopupWindow() {
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
        <button onClick={() => closeWindow()}>Close popup</button>
      </div>
    </>
  );
}

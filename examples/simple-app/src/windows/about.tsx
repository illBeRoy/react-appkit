import { Link } from '@react-appkit/sdk/routing';
import imagePng from '../assets/image.png';
import { Window } from '@react-appkit/sdk/window';

export default function AboutWindow() {
  return (
    <>
      <Window>
        <Window.Title closable={false}>About</Window.Title>
        <Window.Resizable resizable={false} />
        <Window.Size width={200} height={200} />
        <Window.Position x={'50%'} y={'50%'} origin="center" />
      </Window>
      <div>
        About: what a cool app
        <br />
        <img src={imagePng} alt="image" width={100} height={100} />
        <Link to="/">Back to index</Link>
      </div>
    </>
  );
}

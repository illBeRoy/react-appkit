import { Link } from '@react-appkit/sdk/routing';
import imagePng from '../assets/image.png';

export default function AboutWindow() {
  return (
    <div>
      About: what a cool app
      <br />
      <img src={imagePng} alt="image" width={100} height={100} />
      <Link to="/">Back to index</Link>
    </div>
  );
}

import { Link } from '@react-appkit/sdk/routing';

export default function Window() {
  return (
    <div>
      <div>This is index!</div>
      <Link to="/about">About</Link>
    </div>
  );
}

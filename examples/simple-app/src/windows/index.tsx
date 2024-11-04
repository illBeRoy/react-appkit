import { Link } from '@react-appkit/runtime/routing';

export default function Window() {
  return (
    <div>
      <div>This is index!</div>
      <Link to="/about">About</Link>
    </div>
  );
}

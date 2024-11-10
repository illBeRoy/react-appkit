import type { LayoutProps } from '@react-appkit/sdk/layout';
import { Window } from '@react-appkit/sdk/window';

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <Window>
        <Window.Title>Simple App</Window.Title>
        <Window.Size width={300} height={300} />
        <Window.Position x="50%" y="50%" origin="center" />
      </Window>
      {children}
    </>
  );
}

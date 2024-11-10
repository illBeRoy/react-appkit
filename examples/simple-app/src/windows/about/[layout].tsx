import type { LayoutProps } from '@react-appkit/sdk/layout';
import { Window } from '@react-appkit/sdk/window';

export default function AboutLayout({ children }: LayoutProps) {
  return (
    <>
      <Window>
        <Window.Title closable={true}>About</Window.Title>
        {/* <Window.Resizable resizable={false} /> */}
        <Window.Size width={200} height={200} />
        <Window.Position x={'50%'} y={'50%'} origin="center" />
      </Window>
      {children}
    </>
  );
}

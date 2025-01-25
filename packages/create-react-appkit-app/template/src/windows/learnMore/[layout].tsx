import type { LayoutProps } from '@react-appkit/sdk/layout';
import { Window } from '@react-appkit/sdk/window';

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <Window>
        <Window.Title maximizable={false} minimizable={false}>
          About
        </Window.Title>
        <Window.AlwaysOnTop />
        <Window.Dimensions
          width={500}
          height={300}
          x="50%"
          y="50%"
          origin="center"
        />
      </Window>
      {children}
    </>
  );
}

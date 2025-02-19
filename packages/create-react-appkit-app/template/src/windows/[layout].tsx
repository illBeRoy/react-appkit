import type { LayoutProps } from '@react-appkit/sdk/layout';
import { Window } from '@react-appkit/sdk/window';

export default function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <Window>
        <Window.Title>React Notepad</Window.Title>
        <Window.Dimensions
          width={800}
          height={600}
          x="50%"
          y="50%"
          origin="center"
        />
      </Window>
      {children}
    </>
  );
}

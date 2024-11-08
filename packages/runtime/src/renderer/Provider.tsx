import { useEffect, useState } from 'react';
import { show } from '@react-appkit/runtime/main/api/window';
import { RendererGlobalStateProvider } from './RendererGlobalStateProvider';

export interface Props {
  children: React.ReactNode;
}

export const RendererProcessProvider = ({ children }: Props) => {
  const [globalStateReady, setGlobalStateReady] = useState(false);

  useEffect(() => {
    if (globalStateReady) {
      show();
    }
  }, [globalStateReady]);

  return (
    <RendererGlobalStateProvider
      onReady={() => {
        setGlobalStateReady(true);
      }}
    >
      {children}
    </RendererGlobalStateProvider>
  );
};

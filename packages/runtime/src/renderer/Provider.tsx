import { useEffect } from 'react';
import { show } from '@react-appkit/runtime/main/api/window';

export interface Props {
  children: React.ReactNode;
}

export const RendererProcessProvider = ({ children }: Props) => {
  useEffect(() => {
    show();
  }, []);

  return children;
};

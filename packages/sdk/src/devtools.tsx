import { useEffect } from 'react';
import {
  openDevTools,
  closeDevTools,
} from '@react-appkit/runtime/main/api/devtools';

export const Devtools = () => {
  useEffect(() => {
    openDevTools();

    return () => {
      closeDevTools();
    };
  }, []);

  return null;
};

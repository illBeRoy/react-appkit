/**
 * @module devtools
 * APIs to control the devtools window in the renderer process.
 */

import { useEffect } from 'react';
import {
  openDevTools,
  closeDevTools,
} from '@react-appkit/runtime/main/api/devtools';

/**
 * React Component that, if mounted, opens the devtools window.
 * Closes the devtools window when unmounted.
 */
export const Devtools = () => {
  useEffect(() => {
    openDevTools();

    return () => {
      closeDevTools();
    };
  }, []);

  return null;
};

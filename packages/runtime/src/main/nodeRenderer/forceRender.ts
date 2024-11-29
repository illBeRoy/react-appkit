import { useEffect, useState } from 'react';

/**
 * This is a helper function that allows us to force a re-render a component.
 */
export const createForceRenderer = () => {
  let forceRenderHandler = () => {};

  const hook = () => {
    const [_, setRenderAt] = useState(Date.now());

    useEffect(() => {
      forceRenderHandler = () => setRenderAt(Date.now());

      return () => {
        forceRenderHandler = () => {};
      };
    }, [setRenderAt]);
  };

  function forceRender() {
    forceRenderHandler();
  }

  return {
    hook,
    forceRender,
  };
};

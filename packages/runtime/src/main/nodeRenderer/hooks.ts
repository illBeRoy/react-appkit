import { useEffect, useRef } from 'react';

export const useFirstRender = (fnToRunOnFirstRender: () => void) => {
  const firstRenderRef = useRef(true);

  if (firstRenderRef.current) {
    fnToRunOnFirstRender();
    firstRenderRef.current = false;
  }
};

export const useUnmount = (fnToRunOnUnmount: () => void) => {
  useEffect(() => {
    return () => fnToRunOnUnmount();
  }, []);
};

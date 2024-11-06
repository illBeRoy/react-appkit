import type { Tray } from 'electron';

export type TrayManager = ReturnType<typeof createTrayManager>;

export const createTrayManager = () => {
  const create = () => {
    console.log('created');
  };

  const destroy = () => {
    console.log('destroyed');
  };

  return { create, destroy };
};

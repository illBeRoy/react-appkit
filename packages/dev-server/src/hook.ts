import type { DevServerEvent } from './event';

export const dev = () => {
  // @ts-expect-error defined in loader.ts
  const ws: WebSocket | undefined = globalThis.__DEV_SERVER_WS__;

  const onReload = (cb: () => void) => {
    console.log(ws);
    ws?.addEventListener('message', (e) => {
      const event: DevServerEvent = JSON.parse(e.data.toString());
      if (event.type === 'reload') {
        cb();
      }
    });
  };

  const onUpdate = (update: string, cb: () => void) => {
    ws?.addEventListener('message', (e) => {
      const event: DevServerEvent = JSON.parse(e.data.toString());
      if (event.type === 'update' && event.update === update) {
        cb();
      }
    });
  };

  return { onReload, onUpdate };
};

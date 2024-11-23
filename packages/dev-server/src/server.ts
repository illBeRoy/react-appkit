import { WebSocketServer } from 'ws';
import type { ReloadEvent, UpdateEvent } from './event';

export interface DevServerOpts {
  port: number;
}

export const createDevServer = (opts: DevServerOpts) => {
  const ws = new WebSocketServer({ port: opts.port });

  const awaitReady = () =>
    new Promise((resolve, reject) =>
      ws.once('listening', resolve).once('error', reject),
    );

  const close = () => ws.close();

  const send = {
    reload: () => {
      const reloadEvent: ReloadEvent = { type: 'reload' };
      ws.clients.forEach((ws) => ws.send(JSON.stringify(reloadEvent)));
    },
    update: (update: string) => {
      const updateEvent: UpdateEvent = { type: 'update', update };
      ws.clients.forEach((ws) => ws.send(JSON.stringify(updateEvent)));
    },
  };

  return { awaitReady, close, send };
};

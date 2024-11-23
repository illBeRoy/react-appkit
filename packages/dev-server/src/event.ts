export type DevServerEvent = ReloadEvent | UpdateEvent;

export interface ReloadEvent {
  type: 'reload';
}

export interface UpdateEvent {
  type: 'update';
  update: string;
}

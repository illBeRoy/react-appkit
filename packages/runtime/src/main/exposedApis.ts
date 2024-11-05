export type ApisMap = Map<string, (...args: unknown[]) => unknown>;

export const exposedApis: ApisMap = new Map();

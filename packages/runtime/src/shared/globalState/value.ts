export interface GlobalStateValue<T = unknown> {
  data: T;
  updatedAt: number;
}

export const toGlobalStateValue = <T = unknown>(
  data: T,
): GlobalStateValue<T> => {
  return {
    data,
    updatedAt: performance.timeOrigin + performance.now(),
  };
};

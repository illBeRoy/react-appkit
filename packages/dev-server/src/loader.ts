if (
  // @ts-expect-error used only in this file
  !globalThis.__DEV_SERVER_WS__ &&
  // @ts-expect-error defined via vite plugin; see src/vite.ts
  typeof __DEV_SERVER_PORT__ !== 'undefined'
) {
  // @ts-expect-error see above
  globalThis.__DEV_SERVER_WS__ = new WebSocket(
    // @ts-expect-error see above
    `ws://localhost:${__DEV_SERVER_PORT__}`,
  );
}

/**
 * This file runs in the "preload" phase of the renderer process.
 * It is used to create a bridge between the renderer and main processes.
 * The context in which this code runs is a node context, NOT the browser.
 */

import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld(
  '__invokeMainProcessApi__',
  (fnName: string, ...params: unknown[]) =>
    ipcRenderer.invoke('invokeMainProcessApi', fnName, ...params),
);

contextBridge.exposeInMainWorld('__globalState__', {
  addEventListener: (callback: () => void) => {
    ipcRenderer.on('globalStateChange', () => {
      callback();
    });
  },
});

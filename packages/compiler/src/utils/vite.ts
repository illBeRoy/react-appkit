import path from 'node:path';

export const virtual = (virtualFiles: Record<string, string>) => ({
  name: '@react-appkit:virtual-files',
  resolveId(id: string) {
    if (id in virtualFiles) {
      return id;
    }
  },
  load(id: string) {
    if (id in virtualFiles) {
      return virtualFiles[id];
    }
  },
});

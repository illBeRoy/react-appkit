import { type AppRuntimeOptions } from '@react-appkit/runtime/main/app';

const srcActionsAllModules = import.meta.glob(
  './src/actions/*.{ts,tsx,js,jsx}',
  {
    eager: true,
  },
);

const userActions: AppRuntimeOptions['userActions'] = [];

Object.entries(srcActionsAllModules).forEach(
  async ([filename, allExported]) => {
    Object.entries(allExported as Record<string, unknown>).forEach(
      ([fnName, exported]) => {
        const filenameWithoutExt = filename.slice(0, filename.lastIndexOf('.'));

        userActions.push({
          fileName: filenameWithoutExt,
          exportedValueName: fnName,
          exportedValue: exported,
        });
      },
    );
  },
);

export { userActions };

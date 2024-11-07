export type ActionsRegistry = ReturnType<typeof createActionsRegistry>;

export type ActionNamespace = 'builtin' | 'user';

export class ValueNotAnActionError extends Error {
  name = 'ValueNotAnActionError';

  constructor(action: string, filename: string) {
    super(
      `The exported value "${action}" from file "${filename}" is not an action. Only actions and types can be exported from action files.`,
    );
  }
}

export class ActionNotAsyncError extends Error {
  name = 'ActionNotAsyncError';

  constructor(action: string, filename: string) {
    super(
      `The action "${action}" (from file "${filename}") is a function, but is not async. Please rewrite it as an async function.`,
    );
  }
}

export const createActionsRegistry = () => {
  const actions = new Map<string, (...args: unknown[]) => Promise<unknown>>();

  function registerAction(
    namespace: ActionNamespace,
    filename: string,
    fnName: string,
    value: unknown,
  ) {
    if (typeof value !== 'function') {
      throw new ValueNotAnActionError(fnName, filename);
    }

    if (value.constructor.name !== 'AsyncFunction') {
      throw new ActionNotAsyncError(fnName, filename);
    }

    actions.set(
      `${namespace}.${filename}.${fnName}`,
      value as (...args: unknown[]) => Promise<unknown>,
    );
  }

  function getAction(
    namespace: ActionNamespace,
    filename: string,
    fnName: string,
  ) {
    return actions.get(`${namespace}.${filename}.${fnName}`);
  }

  return { registerAction, getAction };
};

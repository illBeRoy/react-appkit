const possiblyFnName = (action: string) => action.split('.').pop();

const possiblyFilename = (action: string) =>
  `actions/${action.split('.').shift()}.ts`;

export class ValueNotAnActionError extends Error {
  name = 'ValueNotAnActionError';

  constructor(action: string) {
    super(
      `The exported value "${possiblyFnName(action)}" from file "${possiblyFilename(
        action,
      )}" is not an action. Only actions and types can be exported from action files.`,
    );
  }
}

export class ActionNotAsyncError extends Error {
  name = 'ActionNotAsyncError';

  constructor(action: string) {
    super(
      `The action "${possiblyFnName(action)}" (from file "${possiblyFilename(
        action,
      )}") is a function, but is not async. Please rewrite it as an async function.`,
    );
  }
}

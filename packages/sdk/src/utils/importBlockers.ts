export const allowImportingOnlyOnMainProcess = <
  TArgs extends unknown[],
  TReturn,
>(
  fn: (...args: TArgs) => TReturn,
  message?: string,
): ((...args: TArgs) => TReturn) => {
  return function (...args: TArgs): TReturn {
    if (
      typeof process === 'undefined' ||
      !process ||
      process.type === 'renderer'
    ) {
      throw new OnlyOnMainProcessError(
        fn.name,
        message ?? 'No reason provided',
      );
    }

    return fn(...args);
  };
};

export class OnlyOnMainProcessError extends Error {
  name = 'OnlyOnMainProcessError';

  constructor(fnName: string, reason?: string) {
    super(
      `The function "${fnName}" can only be called on the main process${
        reason ? `; reason: ${reason}` : ''
      }`,
    );
  }
}

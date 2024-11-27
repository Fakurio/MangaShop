export const catchError = <T>(
  promise: Promise<T>,
): Promise<[undefined, T] | [Error]> =>
  promise
    .then((data) => {
      return [undefined, data] as [undefined, T];
    })
    .catch((error) => {
      return [error];
    });

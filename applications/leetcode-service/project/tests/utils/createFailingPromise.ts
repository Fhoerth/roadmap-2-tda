function createFailingPromise<T>(count = 3, value: T): () => Promise<T> {
  let failureCount = 0;

  return () =>
    new Promise<T>((resolve, reject) => {
      failureCount += 1;

      if (failureCount <= count) {
        reject(new Error(`Failed attempt ${failureCount}`));
      } else {
        resolve(value);
      }
    });
}

export { createFailingPromise };

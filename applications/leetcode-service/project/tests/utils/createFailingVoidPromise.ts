function createFailingVoidPromise(count = 3): () => Promise<void> {
  let failureCount = 0;

  return () =>
    new Promise<void>((resolve, reject) => {
      failureCount += 1;

      if (failureCount <= count) {
        reject(new Error(`Failed attempt ${failureCount}`));
      } else {
        resolve();
      }
    });
}

export { createFailingVoidPromise };

import { DeferredTimeoutPromise } from '../main/modules/DeferredTimeoutPromise';

describe('DeferredTimeoutPromise', () => {
  it('auto-rejects', async () => {
    const timeoutPromise = new DeferredTimeoutPromise(1000);
    await expect(timeoutPromise.waitForPromise()).rejects.toThrow('Timeout');
  });

  it('does not reject if it is resolved before timeout', async () => {
    const timeoutPromise = new DeferredTimeoutPromise(1000);
    setTimeout(() => {
      timeoutPromise.resolve();
    }, 900);

    await timeoutPromise.waitForPromise();
  });

  it('allows promise to be reset', async () => {
    let count = 10;
    const timeoutPromise = new DeferredTimeoutPromise(1000);

    const interval = setInterval(() => {
      if (count === 0) {
        timeoutPromise.resolve();
      } else {
        timeoutPromise.reset();
        count -= 1;
      }
    }, 50);

    await timeoutPromise.waitForPromise();
    interval.unref();
  });
});

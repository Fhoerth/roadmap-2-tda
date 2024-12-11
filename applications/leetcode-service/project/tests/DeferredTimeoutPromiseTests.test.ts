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

  it('does not allow to be reset', async () => {
    const timeoutPromise = new DeferredTimeoutPromise(1000);

    const timeout = setTimeout(() => {
      expect(() => timeoutPromise.reset()).toThrow();
      timeoutPromise.resolve();
      expect(() => timeoutPromise.reset()).toThrow();
    }, 500);

    await timeoutPromise.waitForPromise();
    timeout.unref();
  });
});

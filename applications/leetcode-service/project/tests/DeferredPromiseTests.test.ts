import {
  DeferredPromise,
  DeferredPromiseStatus,
} from '../main/modules/DeferredPromise';

function createTimeoutPromise(t: number): {
  isFulfilled: () => boolean;
  waitForPromise: () => Promise<void>;
} {
  let fulfilled: boolean = false;

  const isFulfilled = (): boolean => fulfilled;
  const promise = new Promise<void>((resolve) =>
    setTimeout(() => {
      fulfilled = true;
      resolve();
    }, t),
  );
  const waitForPromise = async (): Promise<void> => {
    return promise;
  };

  return { isFulfilled, waitForPromise };
}

describe('DeferredPromise', () => {
  it('resolves the promise', async () => {
    const deferredPromise = new DeferredPromise<void>();
    expect(deferredPromise.status).toEqual(DeferredPromiseStatus.PENDING);

    setTimeout(() => {
      deferredPromise.resolve();
    }, 500);

    await deferredPromise.waitForPromise();
    expect(deferredPromise.status).toEqual(DeferredPromiseStatus.FULFILLED);
  });

  it('does not auto-resolve', async () => {
    const timeoutPromise = createTimeoutPromise(500);
    const deferredPromise = new DeferredPromise<void>();

    await Promise.race([
      timeoutPromise.waitForPromise(),
      deferredPromise.waitForPromise(),
    ]);

    expect(timeoutPromise.isFulfilled()).toBe(true);
    expect(deferredPromise.status).toBe(DeferredPromiseStatus.PENDING);
  });

  it('resolves sync', async () => {
    const deferredPromise = new DeferredPromise<void>();
    deferredPromise.resolve();

    await deferredPromise.waitForPromise();
  });

  it('rejects sync', async () => {
    const deferredPromise = new DeferredPromise<void>();
    deferredPromise.reject(new Error('Error'));

    await expect(deferredPromise.waitForPromise()).rejects.toThrow('Error');
  });

  it('allows any type', async () => {
    const deferredPromise = new DeferredPromise<number>();
    deferredPromise.resolve(50);

    const result = await deferredPromise.waitForPromise();

    expect(result).toBe(50);
  });

  it('does not resolve after it is rejected', () => {
    const deferredPromise = new DeferredPromise<void>();

    deferredPromise.resolve();
    deferredPromise.reject(new Error('Error'));

    expect(deferredPromise.status).toEqual(DeferredPromiseStatus.FULFILLED);
  });

  it('does not rejects after it is resolved', async () => {
    const deferredPromise = new DeferredPromise<void>();

    deferredPromise.reject(new Error('Error'));

    await expect(deferredPromise.waitForPromise()).rejects.toThrow('Error');

    deferredPromise.resolve();

    expect(deferredPromise.status).toEqual(DeferredPromiseStatus.REJECTED);
  });

  it('resets sync before being resolved/rejected', async () => {
    const deferredPromise = new DeferredPromise<number>();

    deferredPromise.resolve(10);
    deferredPromise.reset();
    deferredPromise.resolve(15);

    const result = await deferredPromise.waitForPromise();

    expect(result).toBe(15);
  });

  it('resets async before being resolved/rejected', async () => {
    const deferredPromise = new DeferredPromise<void>();

    setTimeout(() => {
      deferredPromise.resolve();
      deferredPromise.reset();
    });

    setTimeout(() => {
      deferredPromise.resolve();
    }, 500);

    await deferredPromise.waitForPromise();
    await deferredPromise.waitForPromise();
  });

  it('resets after being resolved', async () => {
    const deferredPromise = new DeferredPromise<number>();

    deferredPromise.resolve(10);
    const result1 = await deferredPromise.waitForPromise();
    expect(result1).toBe(10);

    deferredPromise.reset();

    deferredPromise.resolve(20);
    const result2 = await deferredPromise.waitForPromise();
    expect(result2).toBe(20);
  });

  it('resets after being rejected', async () => {
    const deferredPromise = new DeferredPromise<number>();

    deferredPromise.reject(new Error('Error'));
    await expect(deferredPromise.waitForPromise()).rejects.toThrow('Error');

    deferredPromise.reset();
    deferredPromise.resolve(10);
    const result1 = await deferredPromise.waitForPromise();

    expect(result1).toEqual(10);
  });

  it('allows multiple rests', async () => {
    const deferredPromise = new DeferredPromise<number>();

    setTimeout(() => {
      deferredPromise.resolve(5);
      deferredPromise.reset();
    }, 10);

    setTimeout(() => {
      deferredPromise.resolve(15);
      deferredPromise.reset();
    }, 15);

    setTimeout(() => {
      deferredPromise.resolve(45);
      deferredPromise.reset();
    }, 20);

    const result1 = await deferredPromise.waitForPromise();
    const result2 = await deferredPromise.waitForPromise();
    const result3 = await deferredPromise.waitForPromise();

    expect(result1).toBe(5);
    expect(result2).toBe(15);
    expect(result3).toBe(45);
  });

  it('allows clearing', async () => {
    const deferredPromise = new DeferredPromise<number>();

    deferredPromise.clear();
    deferredPromise.clear();
    deferredPromise.clear();

    deferredPromise.resolve(15);
    const result1 = await deferredPromise.waitForPromise();
    expect(result1).toBe(15);

    deferredPromise.clear();
    deferredPromise.clear();
    deferredPromise.clear();

    deferredPromise.resolve(50);
    const result2 = await deferredPromise.waitForPromise();
    expect(result2).toBe(50);
  });

  it('resolves promise when safe resetting', async () => {
    const resolvedDeferredPromise = new DeferredPromise<number>();
    const deferredPromise = new DeferredPromise<number>();
    
    deferredPromise.waitForPromise().then((value) => {
      resolvedDeferredPromise.resolve(value);
    });
    
    deferredPromise.safeReset();
    deferredPromise.safeReset();
    deferredPromise.safeReset();
    
    deferredPromise.resolve(20);

    const result = await resolvedDeferredPromise.waitForPromise();

    expect(result).toEqual(20);
  });
});

import { DeferredPromise } from '../main/modules/DeferredPromise';
import { SingleTaskProcessor } from '../main/modules/SingleTaskProcessor';
import { createFailingPromise } from './utils/createFailingPromise';

jest.setTimeout(10000);

describe('SingleTaskProcessor', () => {
  it('processes a single task', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromiseTask1 = processor.enqueueTask(() =>
      Promise.resolve(10),
    );

    expect(await deferredPromiseTask1.waitForPromise()).toBe(10);
  });

  it('processes two tasks', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromiseTask1 = processor.enqueueTask(() =>
      Promise.resolve(10),
    );
    const deferredPromiseTask2 = processor.enqueueTask(() =>
      Promise.resolve(20),
    );

    const results = await Promise.all([
      deferredPromiseTask1.waitForPromise(),
      deferredPromiseTask2.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20]);
  });

  it('processes three tasks', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromiseTask1 = processor.enqueueTask(() =>
      Promise.resolve(10),
    );
    const deferredPromiseTask2 = processor.enqueueTask(() =>
      Promise.resolve(20),
    );
    const deferredPromiseTask3 = processor.enqueueTask(() =>
      Promise.resolve(30),
    );

    const results = await Promise.all([
      deferredPromiseTask1.waitForPromise(),
      deferredPromiseTask2.waitForPromise(),
      deferredPromiseTask3.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes tasks when solve takes some time', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromiseTask1 = processor.enqueueTask(
      () =>
        new Promise<number>((resolve) => {
          setTimeout(() => resolve(10), 300);
        }),
    );
    const deferredPromiseTask2 = processor.enqueueTask(
      () =>
        new Promise<number>((resolve) => {
          setTimeout(() => resolve(20), 200);
        }),
    );
    const deferredPromiseTask3 = processor.enqueueTask(
      () =>
        new Promise<number>((resolve) => {
          setTimeout(() => resolve(30), 100);
        }),
    );

    const results = await Promise.all([
      deferredPromiseTask1.waitForPromise(),
      deferredPromiseTask2.waitForPromise(),
      deferredPromiseTask3.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes one task at a time', async () => {
    let activeTaskCount = 0;

    const processor = new SingleTaskProcessor<string>();
    const createTaskMock = (id: number) => {
      return jest.fn(async () => {
        if (activeTaskCount > 0) {
          throw new Error(
            `Task ${id} was executed while another task was active!`,
          );
        }

        activeTaskCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        activeTaskCount--;

        return `Task ${id} completed`;
      });
    };

    const deferredPromises: DeferredPromise<string>[] = [];
    const nTasks = 50;

    for (let i = 0; i < nTasks; i += 1) {
      deferredPromises.push(processor.enqueueTask(createTaskMock(i)));
    }

    const promises = deferredPromises.map((dP) => dP.waitForPromise());
    const results = await Promise.all(promises);

    for (let i = 0; i < nTasks; i += 1) {
      expect(results[i]).toEqual(`Task ${i} completed`);
    }
  });

  it('allows tasks to handle errors', async () => {
    const processor = new SingleTaskProcessor<string>();

    const deferredPromiseTask1 = processor.enqueueTask(() =>
      Promise.reject(new Error('Error Task 1')).catch(() => {
        return 'Task 1 error has been catched';
      }),
    );
    const deferredPromiseTask2 = processor.enqueueTask(() =>
      Promise.reject(new Error('Error Task 2')).catch(() => {
        return 'Task 2 error has been catched';
      }),
    );

    const results = await Promise.all([
      deferredPromiseTask1.waitForPromise(),
      deferredPromiseTask2.waitForPromise(),
    ]);

    expect(results).toEqual([
      'Task 1 error has been catched',
      'Task 2 error has been catched',
    ]);
  });

  it('allows heavy tasks to handle errors', async () => {
    const processor = new SingleTaskProcessor<string>();

    const deferredPromiseTask1 = processor.enqueueTask(async () => {
      const promise = new Promise<string>((_, reject) => {
        setTimeout(() => reject('Error Task 1'), 300);
      });

      return promise.catch(() => 'Task 1 error has been catched');
    });
    const deferredPromiseTask2 = processor.enqueueTask(async () => {
      const promise = new Promise<string>((_, reject) => {
        setTimeout(() => reject('Error Task 2'), 100);
      });

      return promise.catch(() => 'Task 2 error has been catched');
    });

    const results = await Promise.all([
      deferredPromiseTask1.waitForPromise(),
      deferredPromiseTask2.waitForPromise(),
    ]);

    expect(results).toEqual([
      'Task 1 error has been catched',
      'Task 2 error has been catched',
    ]);
  });

  it('when a task fails it retries until is resolved', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromises = [
      processor.enqueueTask(async () => Promise.resolve(10)),
      processor.enqueueTask(async () => Promise.resolve(20)),
      processor.enqueueTask(createFailingPromise<number>(3, 30)),
      processor.enqueueTask(async () => Promise.resolve(40)),
      processor.enqueueTask(async () => Promise.resolve(50)),
    ];

    const promises = deferredPromises.map((dp) => dp.waitForPromise());
    const results = await Promise.all(promises);

    expect(results).toEqual([10, 20, 30, 40, 50]);
  });

  it('rejects a task when it a cannot be resolved after trying 5 times', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromises = [
      processor.enqueueTask(createFailingPromise<number>(10, 10)),
      processor.enqueueTask(async () => Promise.resolve(20)),
      processor.enqueueTask(async () => Promise.resolve(30)),
      processor.enqueueTask(async () => Promise.resolve(40)),
      processor.enqueueTask(async () => Promise.resolve(50)),
    ];

    expect(deferredPromises[0].waitForPromise()).rejects.toThrow();

    const promises = deferredPromises.slice(1).map((dp) => dp.waitForPromise());
    const results = await Promise.all(promises);

    expect(results).toEqual([20, 30, 40, 50]);
  });

  it('allows all tasks to be rejected', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromises = [
      // First promise will be unqueued automatically so we set reject, but we expect
      // normal promises to be rejected :).
      processor.enqueueTask(async () => Promise.reject(new Error('Error!'))),
      processor.enqueueTask(async () => Promise.resolve(20)),
      processor.enqueueTask(async () => Promise.resolve(30)),
    ];

    processor.rejectAll();

    const waitForDeferredPromise = async (
      dP: DeferredPromise<number>,
    ): Promise<void> => {
      expect(dP.waitForPromise()).rejects.toThrow();
    };

    for (const dP of deferredPromises) {
      await waitForDeferredPromise(dP);
    }
  });
});

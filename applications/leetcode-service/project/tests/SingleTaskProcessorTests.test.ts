import { DeferredPromise } from '../main/modules/DeferredPromise';
import { SingleTaskProcessor, Task } from '../main/modules/SingleTaskProcessor';

jest.setTimeout(10000);

describe('SingleTaskProcessor', () => {
  it('processes a single task', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromise1 = new DeferredPromise<number>();
    const task1 = new Task<number>({
      deferredPromise: deferredPromise1,
      solve: () => Promise.resolve(10),
    });

    processor.enqueueTask(task1);

    expect(await task1.waitForPromise()).toBe(10);
  });

  it('processes two tasks', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromise1 = new DeferredPromise<number>();
    const deferredPromise2 = new DeferredPromise<number>();

    const task1 = new Task<number>({
      deferredPromise: deferredPromise1,
      solve: () => Promise.resolve(10),
    });
    const task2 = new Task<number>({
      deferredPromise: deferredPromise2,
      solve: () => Promise.resolve(20),
    });

    processor.enqueueTask(task1);
    processor.enqueueTask(task2);

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20]);
  });

  it('processes three tasks', async () => {
    const processor = new SingleTaskProcessor<number>();
    const deferredPromise1 = new DeferredPromise<number>();
    const deferredPromise2 = new DeferredPromise<number>();
    const deferredPromise3 = new DeferredPromise<number>();

    const task1 = new Task<number>({
      deferredPromise: deferredPromise1,
      solve: () => Promise.resolve(10),
    });
    const task2 = new Task<number>({
      deferredPromise: deferredPromise2,
      solve: () => Promise.resolve(20),
    });
    const task3 = new Task<number>({
      deferredPromise: deferredPromise3,
      solve: () => Promise.resolve(30),
    });

    processor.enqueueTask(task1);
    processor.enqueueTask(task2);
    processor.enqueueTask(task3);

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
      task3.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes tasks when solve takes some time', async () => {
    const processor = new SingleTaskProcessor<number>();

    const deferredPromise1 = new DeferredPromise<number>();
    const deferredPromise2 = new DeferredPromise<number>();
    const deferredPromise3 = new DeferredPromise<number>();

    const task1 = new Task<number>({
      deferredPromise: deferredPromise1,
      solve: () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => resolve(10), 300);
        });
      },
    });
    const task2 = new Task<number>({
      deferredPromise: deferredPromise2,
      solve: () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => resolve(20), 200);
        });
      },
    });
    const task3 = new Task<number>({
      deferredPromise: deferredPromise3,
      solve: () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => resolve(30), 100);
        });
      },
    });

    processor.enqueueTask(task1);
    processor.enqueueTask(task2);
    processor.enqueueTask(task3);

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
      task3.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes one task at a time', async () => {
    let activeTaskCount = 0;

    const processor = new SingleTaskProcessor<string>();
    const createTaskMock = (id: number) => {
      const deferredPromise = new DeferredPromise<string>();
      return {
        deferredPromise,
        solve: jest.fn(async () => {
          if (activeTaskCount > 0) {
            throw new Error(
              `Task ${id} was executed while another task was active!`,
            );
          }

          activeTaskCount++;
          await new Promise((resolve) => setTimeout(resolve, 50));
          activeTaskCount--;

          return `Task ${id} completed`;
        }),
      };
    };

    const tasks: Task<string>[] = [];
    const nTasks = 50;

    for (let i = 0; i < nTasks; i += 1) {
      tasks.push(new Task(createTaskMock(i)));
    }

    tasks.forEach((task) => processor.enqueueTask(task));
    const promises = tasks.map((task) => task.waitForPromise());
    const results = await Promise.all(promises);

    for (let i = 0; i < nTasks; i += 1) {
      expect(results[i]).toEqual(`Task ${i} completed`);
    }
  });

  it('allows tasks to handle errors', async () => {
    const processor = new SingleTaskProcessor<string>();

    const deferredPromise1 = new DeferredPromise<string>();
    const deferredPromise2 = new DeferredPromise<string>();

    const task1 = new Task<string>({
      deferredPromise: deferredPromise1,
      solve: () =>
        Promise.reject(new Error('Error Task 1')).catch(() => {
          return 'Task 1 error has been catched';
        }),
    });
    const task2 = new Task<string>({
      deferredPromise: deferredPromise2,
      solve: () =>
        Promise.reject(new Error('Error Task 2')).catch(() => {
          return 'Task 2 error has been catched';
        }),
    });

    processor.enqueueTask(task1);
    processor.enqueueTask(task2);

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
    ]);

    expect(results).toEqual([
      'Task 1 error has been catched',
      'Task 2 error has been catched',
    ]);
  });

  it('allows heavy tasks to handle errors', async () => {
    const processor = new SingleTaskProcessor<string>();

    const deferredPromise1 = new DeferredPromise<string>();
    const deferredPromise2 = new DeferredPromise<string>();

    const task1 = new Task<string>({
      deferredPromise: deferredPromise1,
      solve: async () => {
        const promise = new Promise<string>((_, reject) => {
          setTimeout(() => reject('Error Task 1'), 300);
        });

        return promise.catch(() => 'Task 1 error has been catched');
      },
    });
    const task2 = new Task<string>({
      deferredPromise: deferredPromise2,
      solve: async () => {
        const promise = new Promise<string>((_, reject) => {
          setTimeout(() => reject('Error Task 2'), 100);
        });

        return promise.catch(() => 'Task 2 error has been catched');
      },
    });

    processor.enqueueTask(task1);
    processor.enqueueTask(task2);

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
    ]);

    expect(results).toEqual([
      'Task 1 error has been catched',
      'Task 2 error has been catched',
    ]);
  });
});

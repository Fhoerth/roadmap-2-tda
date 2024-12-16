import { assert } from '../common/utils/assert';
import { sleep } from '../common/utils/sleep';
import { DeferredTimeoutPromise } from '../main/modules/DeferredTimeoutPromise';
import { SingleTaskProcessor, Task } from '../main/modules/SingleTaskProcessor';

jest.setTimeout(10000);

describe('SingleTaskProcessor', () => {
  it('processes a single task', async () => {
    const processor = new SingleTaskProcessor<number>();

    const task1 = processor.enqueueTask('task1', () => Promise.resolve(10));

    expect(await task1.waitForPromise()).toBe(10);
  });

  it('processes two tasks', async () => {
    const processor = new SingleTaskProcessor<number>();

    const task1 = processor.enqueueTask('task1', () => Promise.resolve(10));
    const task2 = processor.enqueueTask('task2', () => Promise.resolve(20));

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20]);
  });

  it('processes three tasks', async () => {
    const processor = new SingleTaskProcessor<number>();

    const task1 = processor.enqueueTask('task1', () => Promise.resolve(10));
    const task2 = processor.enqueueTask('task2', () => Promise.resolve(20));
    const task3 = processor.enqueueTask('task3', () => Promise.resolve(30));

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
      task3.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes tasks when solve takes some time', async () => {
    const processor = new SingleTaskProcessor<number>();

    const task1 = processor.enqueueTask(
      'task1',
      () =>
        new Promise<number>((resolve) => {
          setTimeout(() => resolve(10), 300);
        }),
    );
    const task2 = processor.enqueueTask(
      'task2',
      () =>
        new Promise<number>((resolve) => {
          setTimeout(() => resolve(20), 200);
        }),
    );
    const task3 = processor.enqueueTask(
      'task3',
      () =>
        new Promise<number>((resolve) => {
          setTimeout(() => resolve(30), 100);
        }),
    );

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
      task3.waitForPromise(),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes tasks with timeout', async () => {
    const processor = new SingleTaskProcessor<number>();
    let deferredTimeoutPromise: DeferredTimeoutPromise | undefined = undefined;

    const task = processor.enqueueTaskWithTimeout(
      'task',
      (timeoutPromise: DeferredTimeoutPromise) =>
        new Promise<number>((resolve) => {
          if (!deferredTimeoutPromise) {
            deferredTimeoutPromise = timeoutPromise;
          }

          setTimeout(() => resolve(Math.pow(2, 10)), 1000);
        }),
      100,
    );

    let resetTimes = 5;
    for (let i = resetTimes; i <= 0; i -= 1) {
      await sleep(80);
      const timeoutPromise = assert(
        deferredTimeoutPromise,
      ) as unknown as DeferredTimeoutPromise;
      timeoutPromise.reset();
    }
    const timeoutPromise = assert(
      deferredTimeoutPromise,
    ) as unknown as DeferredTimeoutPromise;
    timeoutPromise.resolve();

    const result = await task.waitForPromise();

    expect(result).toBe(Math.pow(2, 10));
  });

  it('rejects a task when timeout promise is not resolved', async () => {
    const processor = new SingleTaskProcessor<number>();
    const task = processor.enqueueTaskWithTimeout(
      'task',
      () => Promise.resolve(Math.pow(2, 10)),
      100,
    );

    await expect(task.waitForPromise()).rejects.toThrow();
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

    const tasks: Task<string>[] = [];
    const nTasks = 50;

    for (let i = 0; i < nTasks; i += 1) {
      tasks.push(processor.enqueueTask(`task_${i}`, createTaskMock(i)));
    }

    const promises = tasks.map((task) => task.waitForPromise());
    const results = await Promise.all(promises);

    for (let i = 0; i < nTasks; i += 1) {
      expect(results[i]).toEqual(`Task ${i} completed`);
    }
  });

  it('allows tasks to handle errors', async () => {
    const processor = new SingleTaskProcessor<string>();

    const task1 = processor.enqueueTask('task1', () =>
      Promise.reject(new Error('Error Task 1')).catch(() => {
        return 'Task 1 error has been catched';
      }),
    );
    const task2 = processor.enqueueTask('task2', () =>
      Promise.reject(new Error('Error Task 2')).catch(() => {
        return 'Task 2 error has been catched';
      }),
    );

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

    const task1 = processor.enqueueTask('task1', async () => {
      const promise = new Promise<string>((_, reject) => {
        setTimeout(() => reject('Error Task 1'), 300);
      });

      return promise.catch(() => 'Task 1 error has been catched');
    });
    const task2 = processor.enqueueTask('task2', async () => {
      const promise = new Promise<string>((_, reject) => {
        setTimeout(() => reject('Error Task 2'), 100);
      });

      return promise.catch(() => 'Task 2 error has been catched');
    });

    const results = await Promise.all([
      task1.waitForPromise(),
      task2.waitForPromise(),
    ]);

    expect(results).toEqual([
      'Task 1 error has been catched',
      'Task 2 error has been catched',
    ]);
  });

  it('allows all tasks to be rejected', async () => {
    const processor = new SingleTaskProcessor<number>();

    const tasks = [
      // First promise will be unqueued automatically so we set reject, but we expect
      // normal promises to be rejected :).
      processor.enqueueTask('task1', async () =>
        Promise.reject(new Error('Error!')),
      ),
      processor.enqueueTask('task2', async () => Promise.resolve(20)),
      processor.enqueueTask('task3', async () => Promise.resolve(30)),
    ];

    processor.rejectAll();

    const waitForDeferredPromise = async (
      task: Task<number>,
    ): Promise<void> => {
      expect(task.waitForPromise()).rejects.toThrow();
    };

    for (const task of tasks) {
      await waitForDeferredPromise(task);
    }
  });
});

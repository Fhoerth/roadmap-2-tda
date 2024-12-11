import { SingleTaskProcessor, Task } from '../main/modules/SingleTaskProcessor';

jest.setTimeout(10000);

describe('SingleTaskProcessor', () => {
  it('processes a single task', async () => {
    const processor = new SingleTaskProcessor<number>();
    const task1 = new Task<number>({ solve: () => Promise.resolve(10) });
    const resultTask1 = await processor.enqueueTask(task1);

    expect(resultTask1).toBe(10);
  });

  it('processes two tasks', async () => {
    const processor = new SingleTaskProcessor<number>();
    const task1 = new Task<number>({ solve: () => Promise.resolve(10) });
    const task2 = new Task<number>({ solve: () => Promise.resolve(20) });

    const results = await Promise.all([
      processor.enqueueTask(task1),
      processor.enqueueTask(task2),
    ]);

    expect(results).toEqual([10, 20]);
  });

  it('processes three tasks', async () => {
    const processor = new SingleTaskProcessor<number>();
    const task1 = new Task<number>({ solve: () => Promise.resolve(10) });
    const task2 = new Task<number>({ solve: () => Promise.resolve(20) });
    const task3 = new Task<number>({ solve: () => Promise.resolve(30) });

    const results = await Promise.all([
      processor.enqueueTask(task1),
      processor.enqueueTask(task2),
      processor.enqueueTask(task3),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes tasks when solve takes some time', async () => {
    const processor = new SingleTaskProcessor<number>();
    const task1 = new Task<number>({
      solve: () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => resolve(10), 300);
        });
      },
    });
    const task2 = new Task<number>({
      solve: () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => resolve(20), 200);
        });
      },
    });
    const task3 = new Task<number>({
      solve: () => {
        return new Promise<number>((resolve) => {
          setTimeout(() => resolve(30), 100);
        });
      },
    });

    const results = await Promise.all([
      processor.enqueueTask(task1),
      processor.enqueueTask(task2),
      processor.enqueueTask(task3),
    ]);

    expect(results).toEqual([10, 20, 30]);
  });

  it('processes one task at a time', async () => {
    let activeTaskCount = 0;

    const processor = new SingleTaskProcessor<string>();
    const createTaskMock = (id: number) => ({
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
    });

    const tasks: Task<string>[] = [];
    const nTasks = 50;

    for (let i = 0; i < nTasks; i += 1) {
      tasks.push(new Task(createTaskMock(i)));
    }

    const promises = tasks.map((task) => processor.enqueueTask(task));
    const results = await Promise.all(promises);

    for (let i = 0; i < nTasks; i += 1) {
      expect(results[i]).toEqual(`Task ${i} completed`);
    }
  });

  it('allows tasks to handle errors', async () => {
    const processor = new SingleTaskProcessor<string>();

    const task1 = new Task<string>({
      solve: () =>
        Promise.reject(new Error('Error Task 1')).catch(() => {
          return 'Task 1 error has been catched';
        }),
    });
    const task2 = new Task<string>({
      solve: () =>
        Promise.reject(new Error('Error Task 2')).catch(() => {
          return 'Task 2 error has been catched';
        }),
    });

    const result = await Promise.all([
      processor.enqueueTask(task1),
      processor.enqueueTask(task2),
    ]);

    expect(result).toEqual([
      'Task 1 error has been catched',
      'Task 2 error has been catched',
    ]);
  });

  it('allows heavy tasks to handle errors', async () => {
    const processor = new SingleTaskProcessor<string>();

    const task1 = new Task<string>({
      solve: async () => {
        const promise = new Promise<string>((_, reject) => {
          setTimeout(() => reject('Error Task 1'), 300);
        });

        return promise.catch(() => 'Task 1 error has been catched');
      },
    });
    const task2 = new Task<string>({
      solve: async () => {
        const promise = new Promise<string>((_, reject) => {
          setTimeout(() => reject('Error Task 2'), 100);
        });

        return promise.catch(() => 'Task 2 error has been catched');
      },
    });

    const result = await Promise.all([
      processor.enqueueTask(task1),
      processor.enqueueTask(task2),
    ]);

    expect(result).toEqual([
      'Task 1 error has been catched',
      'Task 2 error has been catched',
    ]);
  });
});

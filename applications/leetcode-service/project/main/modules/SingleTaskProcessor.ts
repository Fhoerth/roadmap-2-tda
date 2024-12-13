import { DeferredPromise } from './DeferredPromise';
import { Queue } from './Queue';

class Task<T> {
  #retryTimes: number = 5;

  readonly #solve: () => Promise<T>;
  readonly #deferredPromise: DeferredPromise<T>;

  constructor(solve: () => Promise<T>, deferredPromise: DeferredPromise<T>) {
    this.#solve = solve;
    this.#deferredPromise = deferredPromise;
  }

  public async solve(): Promise<void> {
    try {
      const taskResult = await this.#solve();
      this.#deferredPromise.resolve(taskResult);
    } catch (error) {
      this.#retryTimes -= 1;

      if (this.#retryTimes === 0) {
        if (error instanceof Error) {
          this.reject(error);
        } else {
          this.reject(new Error('Task has been rejected'));
        }
      } else {
        return this.solve();
      }
    }
  }

  public async waitForPromise(): Promise<T> {
    return this.#deferredPromise.waitForPromise();
  }

  public reject(error: Error): void {
    return this.#deferredPromise.reject(error);
  }
}

class SingleTaskProcessor<T> {
  #processingTask: boolean;
  #processingTaskForFirstTime: boolean;
  readonly #waitForTaskToBeResolved: DeferredPromise<void>;
  readonly #queue: Queue<Task<T>>;

  constructor() {
    this.#processingTask = false;
    this.#processingTaskForFirstTime = true;
    this.#waitForTaskToBeResolved = new DeferredPromise();
    this.#queue = new Queue<Task<T>>();
  }

  #dequeueTask(): Task<T> {
    return this.#queue.dequeue();
  }

  #processTasks(): void {
    if (this.#processingTask) {
      this.#waitForTaskToBeResolved
        .waitForPromise()
        .then(() => this.#processTasks());
      return;
    }

    if (!this.#processingTaskForFirstTime) {
      this.#waitForTaskToBeResolved.reset();
    }

    this.#processingTaskForFirstTime = false;

    if (this.#queue.isEmpty()) {
      this.#waitForTaskToBeResolved.resolve();
      return;
    }

    this.#processingTask = true;
    const nextTask = this.#dequeueTask();

    nextTask.solve().then(() => {
      this.#processingTask = false;
      this.#waitForTaskToBeResolved.resolve();
      this.#waitForTaskToBeResolved.reset();

      return this.#processTasks();
    });
  }

  public enqueueTask(solve: () => Promise<T>): DeferredPromise<T> {
    const deferredPromise = new DeferredPromise<T>();
    const task = new Task<T>(solve, deferredPromise);

    this.#queue.enqueue(task);
    this.#processTasks();

    return deferredPromise;
  }

  public rejectAll(): void {
    while (!this.#queue.isEmpty()) {
      const task = this.#dequeueTask();
      task.reject(new Error('Task has been rejected manually (rejectAll)'));
    }
  }

  public isEmpty(): boolean {
    return this.#queue.isEmpty();
  }
}

export { SingleTaskProcessor };

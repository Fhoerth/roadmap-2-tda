import { DeferredPromise } from './DeferredPromise';
import { Queue } from './Queue';

type TaskProcessor<T> = {
  solve: () => Promise<T>;
};

class Task<T> {
  readonly #taskProcessor: TaskProcessor<T>;
  readonly #waitToBeResolved: DeferredPromise<T>;

  constructor(taskProcessor: TaskProcessor<T>) {
    this.#taskProcessor = taskProcessor;
    this.#waitToBeResolved = new DeferredPromise<T>();
  }

  public async solve(): Promise<void> {
    const taskResult = await this.#taskProcessor.solve();
    this.#waitToBeResolved.resolve(taskResult);
  }

  public async waitToBeResolved(): Promise<T> {
    return this.#waitToBeResolved.waitForPromise();
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

    const processSolve = () => {
      this.#processingTask = false;
      this.#waitForTaskToBeResolved.resolve();
      this.#waitForTaskToBeResolved.reset();
      return this.#processTasks();
    };

    nextTask
      .solve()
      .then(processSolve)
      .catch((error) => {
        processSolve();
        throw error;
      });
  }

  public enqueueTask(task: Task<T>): Promise<T> {
    this.#queue.enqueue(task);
    this.#processTasks();

    return task.waitToBeResolved();
  }

  public isEmpty(): boolean {
    return this.#queue.isEmpty();
  }
}

export { Task };
export { SingleTaskProcessor };

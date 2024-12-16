import { DeferredPromise } from './DeferredPromise';
import { DeferredTimeoutPromise } from './DeferredTimeoutPromise';
import { Dequeue } from './Dequeue';

export type Solver<T> = () => Promise<T>;
export type TimeoutSolver<T> = (
  timeoutPromsie: DeferredTimeoutPromise,
) => Promise<T>;

abstract class BaseTask<T> {
  protected readonly solver: Solver<T> | TimeoutSolver<T>;
  protected readonly deferredPromise: DeferredPromise<T>;
  public readonly id: string;

  constructor(
    id: string,
    solver: Solver<T> | TimeoutSolver<T>,
    deferredPromise: DeferredPromise<T>,
  ) {
    this.id = id;
    this.solver = solver;
    this.deferredPromise = deferredPromise;
  }

  public async solve(): Promise<void> {
    try {
      const taskResult = await this.runSolve();
      this.deferredPromise.resolve(taskResult);
    } catch (error) {
      if (error instanceof Error) {
        this.reject(error);
      } else {
        this.reject(new Error('Task has been rejected'));
      }
    }
  }

  protected abstract runSolve(): Promise<T>;

  public async waitForPromise(): Promise<T> {
    return this.deferredPromise.waitForPromise();
  }

  public reject(error: Error): void {
    return this.deferredPromise.reject(error);
  }
}

class Task<T> extends BaseTask<T> {
  readonly #solver: Solver<T>;
  constructor(
    id: string,
    solver: Solver<T>,
    deferredPromise: DeferredPromise<T>,
  ) {
    super(id, solver, deferredPromise);
    this.#solver = solver;
  }

  protected async runSolve(): Promise<T> {
    return this.#solver();
  }
}

class TaskWithTimeout<T> extends BaseTask<T> {
  readonly #solver: TimeoutSolver<T>;
  readonly #timeoutPromise: DeferredTimeoutPromise;

  constructor(
    id: string,
    solver: TimeoutSolver<T>,
    deferredPromise: DeferredPromise<T>,
    timer: number,
  ) {
    super(id, solver, deferredPromise);
    this.#solver = solver;
    this.#timeoutPromise = new DeferredTimeoutPromise(timer, false);
  }

  protected async runSolve(): Promise<T> {
    this.#timeoutPromise.reset();
    this.#timeoutPromise.start();

    const [result] = await Promise.all([
      this.#solver(this.#timeoutPromise),
      this.#timeoutPromise.waitForPromise(),
    ]);

    return result;
  }
}

class SingleTaskProcessor<T> {
  #processingTask: boolean;
  readonly #waitForCurrentTask: DeferredPromise<void>;
  readonly #queue: Dequeue<Task<T> | TaskWithTimeout<T>>;

  constructor() {
    this.#processingTask = false;
    this.#waitForCurrentTask = new DeferredPromise();
    this.#queue = new Dequeue<Task<T> | TaskWithTimeout<T>>();
  }

  #dequeueTask(): Task<T> | TaskWithTimeout<T> {
    return this.#queue.popLeft();
  }

  #processTasks(): void {
    if (this.#processingTask) {
      // Ya hay una tarea procesándose, no iniciar otra.
      return;
    }

    if (this.#queue.isEmpty()) {
      console.log('No tasks in queue, resolving waitForCurrentTask...');
      this.#waitForCurrentTask.resolve(); // Marca que todas las tareas han terminado.
      return;
    }

    console.log('Processing Tasks...');
    console.log(this.#queue.toJSON());

    this.#processingTask = true;

    const nextTask = this.#dequeueTask(); // Obtiene la siguiente tarea de la cola.
    console.log('Processing task:', JSON.stringify(nextTask, null, 2));

    nextTask
      .solve()
      .then(() => {
        console.log('Task resolved:', JSON.stringify(nextTask, null, 2));
      })
      .catch((error) => {
        console.error('Task failed:', error, JSON.stringify(nextTask, null, 2));
      })
      .finally(() => {
        this.#processingTask = false;
        this.#processTasks();
      });
  }

  public enqueueTask(id: string, solver: Solver<T>): Task<T> {
    const deferredPromise = new DeferredPromise<T>();

    const task = new Task<T>(id, solver, deferredPromise);

    this.#queue.pushRight(task);
    this.#processTasks();

    return task;
  }

  public enqueueTaskWithTimeout(
    id: string,
    solver: TimeoutSolver<T>,
    timer: number,
  ): TaskWithTimeout<T> {
    const deferredPromise = new DeferredPromise<T>();
    const task = new TaskWithTimeout<T>(id, solver, deferredPromise, timer);

    this.#queue.pushRight(task);
    this.#processTasks();

    return task;
  }

  public rejectAll(): void {
    while (!this.#queue.isEmpty()) {
      const nextTask = this.#dequeueTask();
      nextTask.reject(new Error('Task has been rejected manually (rejectAll)'));
    }
  }

  public isEmpty(): boolean {
    return this.#queue.isEmpty();
  }
}

export { Task };
export { TaskWithTimeout };
export { SingleTaskProcessor };

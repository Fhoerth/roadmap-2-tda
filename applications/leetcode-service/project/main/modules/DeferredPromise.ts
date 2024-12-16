enum Status {
  PENDING = 'pending',
  FULFILLED = 'resolved',
  REJECTED = 'rejected',
}

type Resolve<T> = T extends void ? () => void : (t: T) => void;

class DeferredPromise<T> {
  readonly #resetError = new Error(
    '__DANGEROUS_DO_NOT_USE__ --> Promise not set.',
  );
  readonly #clearError = new Error(
    '__DANGEROUS_DO_NOT_USE__ --> Promise not set.',
  );
  #promise: Promise<T>;
  public resolve: Resolve<T>;
  public reject: (error: Error) => void;
  public reset: () => void;
  public safeReset: () => void;
  public clear: () => void;
  public status: Status;

  constructor() {
    this.status = Status.PENDING;

    this.resolve = (() => {}) as Resolve<T>;
    this.reject = () => {
      throw new Error('Promise not set.');
    };
    this.reset = (): void => {
      this.reject(this.#resetError);
    };
    this.safeReset = (): void => {
      this.reject(this.#resetError);
    };
    this.clear = (): void => {
      this.reject(this.#clearError);
    };

    this.#promise = this.#createPromise();
  }

  // Do nothing...
  protected onFulfilled(): void {}

  #getPromise(): Promise<T> {
    return this.#promise;
  }

  #createPromise(): Promise<T> {
    return new Promise<T>((resolvePromise, rejectPromise) => {
      this.resolve = ((t: T) => {
        if (this.status === Status.PENDING) {
          this.status = Status.FULFILLED;
        }

        this.onFulfilled();
        resolvePromise(t as T);
      }) as Resolve<T>;

      this.reject = (error: Error) => {
        if (this.status === Status.PENDING) {
          this.status = Status.REJECTED;
        }

        rejectPromise(error);
      };

      this.safeReset = (): void => {
        if (this.status !== Status.PENDING) {
          this.#promise = this.#createPromise();
        }
      };

      this.reset = (): void => {
        if (this.status === Status.PENDING) {
          this.reject(new Error('DeferredPromise was reset.'));
        }

        this.#promise = this.#createPromise();
      };

      this.clear = (): void => {
        this.#promise = this.#createPromise();
      };
    });
  }

  public async waitForPromise(): Promise<T> {
    return await this.#getPromise();
  }
}

export { DeferredPromise };
export { Status as DeferredPromiseStatus };

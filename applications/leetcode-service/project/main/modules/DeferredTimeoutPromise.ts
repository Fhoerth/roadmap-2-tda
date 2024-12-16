import { DeferredPromise } from './DeferredPromise';

class DeferredTimeoutPromise extends DeferredPromise<void> {
  #timer: number;
  #timeout: NodeJS.Timeout | null = null;

  public halt: () => void;

  constructor(timer: number, autoStart = true) {
    super();

    this.#timer = timer;
    this.#setupTimeout(autoStart);

    this.reset = (): void => {
      this.#maybeClearTimeout();
      this.#setupTimeout(autoStart);
    };

    this.halt = (): void => {
      this.#maybeClearTimeout();
    };
  }

  #setupTimeout(autoStart: boolean): void {
    if (autoStart) {
      this.#timeout = this.#createTimeout();
    } else {
      this.#timeout = null;
    }
  }

  #maybeClearTimeout(): void {
    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }
  }

  #createTimeout(): NodeJS.Timeout {
    return setTimeout(() => {
      this.reject(new Error('Timeout'));
    }, this.#timer);
  }

  protected onFulfilled(): void {
    this.#maybeClearTimeout();
  }

  public start(): void {
    this.#timeout = this.#createTimeout();
  }
}

export { DeferredTimeoutPromise };

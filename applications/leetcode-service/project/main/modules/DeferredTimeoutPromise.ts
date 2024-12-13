import { DeferredPromise } from './DeferredPromise';

class DeferredTimeoutPromise extends DeferredPromise<void> {
  #timeout: NodeJS.Timeout;
  public halt: () => void;

  constructor(timer: number) {
    super();
    this.#timeout = this.#createTimeout(timer);

    this.reset = (): void => {
      clearTimeout(this.#timeout);
      this.#timeout = this.#createTimeout(timer);
    };

    this.halt = (): void => {
      clearTimeout(this.#timeout);
    };
  }

  #createTimeout(timer: number): NodeJS.Timeout {
    return setTimeout(() => {
      this.reject(new Error('Timeout'));
    }, timer);
  }

  protected onFulfilled(): void {
    clearTimeout(this.#timeout);
  }
}

export { DeferredTimeoutPromise };

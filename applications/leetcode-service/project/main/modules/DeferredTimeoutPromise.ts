import { DeferredPromise } from './DeferredPromise';

class DeferredTimeoutPromise extends DeferredPromise<void> {
  #timeout: NodeJS.Timeout;

  constructor(t: number) {
    super();

    this.#timeout = setTimeout(() => {
      this.reject(new Error('Timeout'));
    }, t);

    this.reset = () => {
      throw new Error('A DeferredTimeoutPromise cannot be reset');
    };
  }

  protected onFulfilled(): void {
    clearTimeout(this.#timeout);
  }
}

export { DeferredTimeoutPromise };

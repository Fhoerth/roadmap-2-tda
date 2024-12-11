import { Queue } from '../main/modules/Queue';

describe('List (Queue behavior)', () => {
  test('enqueue adds elements and returns node reference', () => {
    const queue = new Queue<number>();
    const value1 = queue.enqueue(1);
    const value2 = queue.enqueue(2);

    expect(value1).toBe(1);
    expect(value2).toBe(2);
  });

  test('dequeue removes elements in FIFO order', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);

    expect(queue.isEmpty()).toBe(true);
  });

  test('dequeue on empty queue throws error', () => {
    const queue = new Queue<number>();
    expect(() => queue.dequeue()).toThrow();
  });

  test('isEmpty returns true for an empty queue', () => {
    const queue = new Queue<number>();
    expect(queue.isEmpty()).toBe(true);

    queue.enqueue(1);
    expect(queue.isEmpty()).toBe(false);
  });

  test('getHead and getTail return correct nodes', () => {
    const queue = new Queue<number>();

    expect(queue.getHead()).toBeNull();
    expect(queue.getTail()).toBeNull();

    const value1 = queue.enqueue(1);
    const value2 = queue.enqueue(2);

    expect(queue.getHead()).toBe(value1);
    expect(queue.getTail()).toBe(value2);
  });

  test('removing head updates the head reference', () => {
    const queue = new Queue<number>();

    queue.enqueue(1);
    queue.enqueue(2);

    queue.dequeue();

    expect(queue.getHead()).toBe(2);
    expect(queue.isEmpty()).toBe(false);

    queue.dequeue();

    expect(queue.isEmpty()).toBe(true);
  });

  test('removing tail updates the tail reference', () => {
    const queue = new Queue<number>();

    queue.enqueue(1);

    queue.dequeue();

    expect(queue.getTail()).toBe(null);
    expect(queue.getHead()).toBeNull();
  });

  test('dequeue maintains consistency after multiple operations', () => {
    const queue = new Queue<number>();
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    expect(queue.dequeue()).toBe(1);
    expect(queue.dequeue()).toBe(2);

    queue.enqueue(4);

    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBe(4);
  });

  test('stress test: dequeue in O(1) for 1000 elements', () => {
    const queue = new Queue<number>();
    const values: number[] = [];

    for (let i = 1; i <= 1000; i++) {
      values.push(queue.enqueue(i));
    }

    let expectedValue = 1;

    while (!queue.isEmpty()) {
      const head = queue.getHead();

      expect(head).toBeTruthy();
      expect(head).toEqual(expectedValue);

      queue.dequeue();
      expectedValue++;
    }

    expect(queue.isEmpty()).toBe(true);
    expect(queue.getHead()).toBeNull();
    expect(queue.getTail()).toBeNull();
  });
});

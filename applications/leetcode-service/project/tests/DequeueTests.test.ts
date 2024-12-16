import { Dequeue } from '../main/modules/Dequeue';
import type { Node } from '../main/modules/Dequeue';

describe('Dequeue', () => {
  test('pushRight adds elements and returns node reference', () => {
    const dequeue = new Dequeue<number>();

    const node1 = dequeue.pushRight(1);
    const node2 = dequeue.pushRight(2);

    expect(node1.value).toBe(1);
    expect(node2.value).toBe(2);
  });

  test('popLeft removes elements in FIFO order', () => {
    const dequeue = new Dequeue<number>();

    dequeue.pushRight(1);
    dequeue.pushRight(2);
    dequeue.pushRight(3);

    expect(dequeue.popLeft()).toBe(1);
    expect(dequeue.popLeft()).toBe(2);
    expect(dequeue.popLeft()).toBe(3);

    expect(dequeue.isEmpty()).toBe(true);
  });

  test('popLeft on empty dequeue throws error', () => {
    const dequeue = new Dequeue<number>();

    expect(() => dequeue.popLeft()).toThrow();
  });

  test('isEmpty returns true for an empty dequeue', () => {
    const dequeue = new Dequeue<number>();
    expect(dequeue.isEmpty()).toBe(true);

    dequeue.pushRight(1);
    expect(dequeue.isEmpty()).toBe(false);
  });

  test('getHead and getTail return correct nodes', () => {
    const dequeue = new Dequeue<number>();

    expect(dequeue.getHead()).toBeNull();
    expect(dequeue.getTail()).toBeNull();

    const node1 = dequeue.pushRight(1);
    const node2 = dequeue.pushRight(2);

    expect(dequeue.getHead()).toBe(node1.value);
    expect(dequeue.getTail()).toBe(node2.value);
  });

  test('removing head updates the head reference', () => {
    const dequeue = new Dequeue<number>();

    dequeue.pushRight(1);
    dequeue.pushRight(2);

    dequeue.popLeft();

    expect(dequeue.getHead()).toBe(2);
    expect(dequeue.isEmpty()).toBe(false);

    dequeue.popLeft();

    expect(dequeue.isEmpty()).toBe(true);
  });

  test('removing tail updates the tail reference', () => {
    const dequeue = new Dequeue<number>();

    dequeue.pushRight(1);
    dequeue.popLeft();

    expect(dequeue.getTail()).toBe(null);
    expect(dequeue.getHead()).toBeNull();
  });

  test('popLeft maintains consistency after multiple operations', () => {
    const dequeue = new Dequeue<number>();

    dequeue.pushRight(1);
    dequeue.pushRight(2);
    dequeue.pushRight(3);

    expect(dequeue.popLeft()).toBe(1);
    expect(dequeue.popLeft()).toBe(2);

    dequeue.pushRight(4);

    expect(dequeue.popLeft()).toBe(3);
    expect(dequeue.popLeft()).toBe(4);
  });

  test('stress test: popLeft for 1000 elements', () => {
    const dequeue = new Dequeue<number>();
    const values: number[] = [];

    for (let i = 1; i <= 1000; i++) {
      values.push(dequeue.pushRight(i).value);
    }

    let expectedValue = 1;

    while (!dequeue.isEmpty()) {
      const head = dequeue.getHead();

      expect(head).toBeTruthy();
      expect(head).toEqual(expectedValue);

      dequeue.popLeft();
      expectedValue++;
    }

    expect(dequeue.isEmpty()).toBe(true);
    expect(dequeue.getHead()).toBeNull();
    expect(dequeue.getTail()).toBeNull();
  });

  test('removes nodes correctly under stress conditions', () => {
    const dequeue = new Dequeue<number>();
    const totalNodes = 10_000;
    const nodes: Array<Node<number>> = [];

    for (let i = 1; i <= totalNodes; i++) {
      const node = dequeue.pushRight(i);
      nodes.push(node);
    }

    expect(JSON.parse(dequeue.toJSON()).length).toBe(totalNodes);

    for (let i = 0; i < nodes.length; i += 1) {
      if (i % 2 === 0) {
        dequeue.removeNode(nodes[i]);
      }
    }

    const expectedSize = totalNodes - Math.floor(totalNodes / 2);
    expect(JSON.parse(dequeue.toJSON()).length).toBe(expectedSize);

    // Verify that all remaining nodes are correctly linked
    let currentValue = 0;
    let prevValue = 0;

    while (!dequeue.isEmpty()) {
      currentValue = dequeue.popLeft();
      expect(currentValue).toBeGreaterThan(prevValue);
      prevValue = currentValue;
    }

    expect(dequeue.isEmpty()).toBe(true);
    expect(dequeue.getHead()).toBeNull();
    expect(dequeue.getTail()).toBeNull();
  });

  test('iteration (forEach) under stress conditions', () => {
    const dequeue = new Dequeue<number>();
    const totalNodes = 10_000;
    const values: Array<number> = [];

    for (let i = 1; i <= totalNodes; i++) {
      const node = dequeue.pushRight(i);
      values.push(node.value);
    }

    let callbackCalled = false;

    dequeue.forEach((value) => {
      callbackCalled = true;

      expect(value).toEqual(values[0]);
      values.splice(0, 1);
    });

    expect(callbackCalled).toBe(true);
  });
});

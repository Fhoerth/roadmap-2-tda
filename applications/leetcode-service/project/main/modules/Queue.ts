class Node<T> {
  value: T;
  next: Node<T> | null = null;
  prev: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class Queue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;

  enqueue(value: T): T {
    const newNode = new Node(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    return newNode.value;
  }

  dequeue(): T {
    if (!this.head) {
      throw new Error('Queue is empty');
    }

    const oldHead = this.head;
    const newHead = this.head.next;

    this.head = newHead;

    if (newHead) {
      newHead.prev = null;
    } else {
      this.tail = null;
    }

    oldHead.next = null;

    return oldHead.value;
  }

  getHead(): T | null {
    return this.head?.value || null;
  }

  getTail(): T | null {
    return this.tail?.value || null;
  }

  isEmpty(): boolean {
    return this.head === null;
  }
}

export { Queue };

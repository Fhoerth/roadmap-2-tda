class Node<T> {
  readonly value: T;
  next: Node<T> | null = null;
  prev: Node<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class Dequeue<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;

  public pushRight(value: T): Node<T> {
    const newNode = new Node(value);

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    return newNode;
  }

  public popLeft(): T {
    if (!this.head) {
      throw new Error('Dequeue is empty');
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

  public removeNode(node: Node<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }

    node.next = null;
    node.prev = null;
  }

  public forEach(callback: (value: T) => void): void {
    let currentNode = this.head;

    while (currentNode) {
      callback(currentNode.value);
      currentNode = currentNode.next;
    }
  }

  public getHead(): T | null {
    return this.head?.value || null;
  }

  public getTail(): T | null {
    return this.tail?.value || null;
  }

  public isEmpty(): boolean {
    return this.head === null;
  }

  public toJSON(): string {
    const result: T[] = [];

    let currentNode: Node<T> | null = this.head;
    while (currentNode != null) {
      result.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return JSON.stringify(result, null, 2);
  }
}

export { Node };
export { Dequeue };

class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;
  prev: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class List<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;

  append(value: T): ListNode<T> {
    const newNode = new ListNode(value);

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

  removeNode(node: ListNode<T>): void {
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

  getHead(): ListNode<T> | null {
    return this.head;
  }

  getTail(): ListNode<T> | null {
    return this.tail;
  }

  isEmpty(): boolean {
    return this.head === null;
  }
}

export { ListNode };
export { List };
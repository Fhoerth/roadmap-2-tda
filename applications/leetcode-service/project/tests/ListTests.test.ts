import { List, ListNode } from '../main/List';

describe('List', () => {
  test('append adds elements and returns node reference', () => {
    const list = new List<number>();
    const node1 = list.append(1);
    const node2 = list.append(2);

    expect(node1.value).toBe(1);
    expect(node2.value).toBe(2);

    expect(node1.next).toBe(node2);
    expect(node2.prev).toBe(node1);
  });

  test('stress test: removeNode in O(1) for 1000 elements', () => {
    const list = new List<number>();
    const nodes: ListNode<number>[] = [];
  
    for (let i = 1; i <= 1000; i++) {
      nodes.push(list.append(i));
    }
  
    while (nodes.length > 2) {
      const middleIndex = Math.floor(nodes.length / 2);
      const middleNode = nodes[middleIndex];
  
      list.removeNode(middleNode);
  
      nodes.splice(middleIndex, 1);
  
      if (middleIndex > 0) {
        expect(nodes[middleIndex - 1].next).toBe(nodes[middleIndex] || null);
      }
      if (middleIndex < nodes.length) {
        expect(nodes[middleIndex].prev).toBe(nodes[middleIndex - 1] || null);
      }
    }
  
    const headNode = nodes[0];
    const tailNode = nodes[1];
  
    list.removeNode(headNode);
    expect(list.getHead()).toBe(tailNode);
    expect(tailNode.prev).toBeNull();
  
    list.removeNode(tailNode);
    expect(list.isEmpty()).toBe(true);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });
  
  test('isEmpty returns true for an empty list', () => {
    const list = new List<number>();
    expect(list.isEmpty()).toBe(true);

    list.append(1);
    expect(list.isEmpty()).toBe(false);
  });

  test('getHead and getTail return correct nodes', () => {
    const list = new List<number>();

    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();

    const node1 = list.append(1);
    const node2 = list.append(2);

    expect(list.getHead()).toBe(node1);
    expect(list.getTail()).toBe(node2);
  });

  test('removing head updates the head reference', () => {
    const list = new List<number>();
    const node1 = list.append(1);
    const node2 = list.append(2);

    list.removeNode(node1);

    expect(list.getHead()).toBe(node2);
    expect(node2.prev).toBeNull();
  });

  test('removing tail updates the tail reference', () => {
    const list = new List<number>();
    const node1 = list.append(1);
    const node2 = list.append(2);

    list.removeNode(node2);

    expect(list.getTail()).toBe(node1);
    expect(node1.next).toBeNull();
  });

  test('removeNode on a single-node list clears the list', () => {
    const list = new List<number>();
    const node1 = list.append(1);

    list.removeNode(node1);

    expect(list.isEmpty()).toBe(true);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });
});
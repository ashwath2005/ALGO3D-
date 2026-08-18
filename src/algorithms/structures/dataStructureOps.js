import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- LINKED LIST ---
export const linkedListOps = {
  id: 'linked-list',
  name: 'Linked List',
  category: 'structures',
  structureType: 'linkedList',
  complexity: {
    timeBest: 'O(1)',
    timeAverage: 'O(n)',
    timeWorst: 'O(n)',
    space: 'O(n)',
    stable: 'N/A'
  },
  description: 'Linear collection of nodes where each node contains data and a pointer referencing the next node in sequence.',
  code: `class Node {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}
function traverse(head) {
  let curr = head;
  while (curr !== null) {
    visit(curr);
    curr = curr.next;
  }
}`,
  execute(initialData = [15, 28, 42, 67, 89]) {
    return this.executeTraverse(initialData);
  },

  executeTraverse(nodes) {
    const list = [...nodes];
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      nodes: [...list],
      description: `Starting Linked List traversal from Head.`,
      codeLine: 8
    }));

    for (let i = 0; i < list.length; i++) {
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [i],
        nodes: [...list],
        description: `Pointer at node index ${i}: Value = ${list[i]}`,
        codeLine: 10
      }));
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: [...list],
      description: `Reached end of list (null pointer). Traversal complete.`,
      codeLine: 12
    }));

    return steps;
  },

  executeInsert(nodes, val = 42, pos = 0) {
    const list = [...nodes];
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.INSERT,
      values: [val],
      nodes: [...list],
      description: `Creating new node with value ${val}`,
      codeLine: 2
    }));

    if (pos === 0) {
      list.unshift(val);
      steps.push(createStep({
        type: OP_TYPES.SET_POINTER,
        indices: [0],
        nodes: [...list],
        description: `New node ${val} linked as new Head.`,
        codeLine: 4
      }));
    } else {
      const idx = Math.min(pos, list.length);
      list.splice(idx, 0, val);
      steps.push(createStep({
        type: OP_TYPES.SET_POINTER,
        indices: [idx],
        nodes: [...list],
        description: `Inserted ${val} at position ${idx}. Pointers adjusted.`,
        codeLine: 4
      }));
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: [...list],
      description: `Insertion complete. List size is now ${list.length}.`,
      codeLine: 5
    }));

    return steps;
  },

  executeDelete(nodes, idx = 0) {
    const list = [...nodes];
    const steps = [];
    if (list.length === 0) return steps;

    const targetIdx = Math.min(idx, list.length - 1);
    const removedVal = list[targetIdx];

    steps.push(createStep({
      type: OP_TYPES.VISIT,
      indices: [targetIdx],
      nodes: [...list],
      description: `Traversing to target node ${removedVal} at index ${targetIdx}`,
      codeLine: 9
    }));

    list.splice(targetIdx, 1);

    steps.push(createStep({
      type: OP_TYPES.DELETE,
      indices: [targetIdx],
      values: [removedVal],
      nodes: [...list],
      description: `Unlinked node ${removedVal}. Next pointer updated.`,
      codeLine: 11
    }));

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: [...list],
      description: `Deletion complete.`,
      codeLine: 12
    }));

    return steps;
  }
};

// --- STACK ---
export const stackOps = {
  id: 'stack',
  name: 'Stack (LIFO)',
  category: 'structures',
  structureType: 'stack',
  complexity: {
    timeBest: 'O(1)',
    timeAverage: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(n)',
    stable: 'N/A'
  },
  description: 'Last-In, First-Out data structure where elements are pushed and popped from the top of the stack chamber.',
  code: `class Stack {
  push(val) {
    this.items.push(val);
  }
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
}`,
  execute(initialData = [12, 24, 38, 52]) {
    const steps = [];
    const stack = [...initialData];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...stack],
      description: `Initial Stack state with ${stack.length} elements. Top element = ${stack[stack.length - 1]}`,
      codeLine: 1
    }));

    // Demo Push
    const newVal = 65;
    steps.push(createStep({
      type: OP_TYPES.INSERT,
      values: [newVal],
      stateSnapshot: [...stack],
      description: `Pushing ${newVal} onto top of stack`,
      codeLine: 3
    }));
    stack.push(newVal);

    steps.push(createStep({
      type: OP_TYPES.HIGHLIGHT,
      indices: [stack.length - 1],
      values: [newVal],
      stateSnapshot: [...stack],
      description: `Element ${newVal} settled at Top of Stack (Height = ${stack.length})`,
      codeLine: 3
    }));

    // Demo Peek
    steps.push(createStep({
      type: OP_TYPES.PEEK,
      indices: [stack.length - 1],
      values: [newVal],
      stateSnapshot: [...stack],
      description: `Peeking top element: ${newVal}`,
      codeLine: 9
    }));

    // Demo Pop
    const popped = stack.pop();
    steps.push(createStep({
      type: OP_TYPES.DELETE,
      indices: [stack.length],
      values: [popped],
      stateSnapshot: [...stack],
      description: `Popped ${popped} from top of stack`,
      codeLine: 6
    }));

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...stack],
      description: `Stack operations complete. Current Top = ${stack[stack.length - 1]}`,
      codeLine: 1
    }));

    return steps;
  },

  executePush(stackData, val = 55) {
    const stack = [...stackData];
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.INSERT,
      values: [val],
      stateSnapshot: [...stack],
      description: `Pushing ${val} onto top of stack`,
      codeLine: 3
    }));

    stack.push(val);

    steps.push(createStep({
      type: OP_TYPES.HIGHLIGHT,
      indices: [stack.length - 1],
      stateSnapshot: [...stack],
      description: `Element ${val} positioned at stack Top (Index ${stack.length - 1})`,
      codeLine: 3
    }));

    return steps;
  },

  executePop(stackData) {
    const stack = [...stackData];
    const steps = [];
    if (stack.length === 0) {
      steps.push(createStep({
        type: OP_TYPES.REJECT,
        stateSnapshot: [],
        description: `Stack Underflow: cannot pop from empty stack.`,
        codeLine: 6
      }));
      return steps;
    }

    const popped = stack[stack.length - 1];
    steps.push(createStep({
      type: OP_TYPES.VISIT,
      indices: [stack.length - 1],
      values: [popped],
      stateSnapshot: [...stack],
      description: `Accessing Top element: ${popped}`,
      codeLine: 6
    }));

    stack.pop();

    steps.push(createStep({
      type: OP_TYPES.DELETE,
      values: [popped],
      stateSnapshot: [...stack],
      description: `Popped ${popped} from stack chamber.`,
      codeLine: 7
    }));

    return steps;
  }
};

// --- QUEUE ---
export const queueOps = {
  id: 'queue',
  name: 'Queue (FIFO)',
  category: 'structures',
  structureType: 'queue',
  complexity: {
    timeBest: 'O(1)',
    timeAverage: 'O(1)',
    timeWorst: 'O(1)',
    space: 'O(n)',
    stable: 'N/A'
  },
  description: 'First-In, First-Out data structure where elements enter at the rear and depart from the front.',
  code: `class Queue {
  enqueue(val) {
    this.items.push(val);
  }
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }
}`,
  execute(initialData = [10, 20, 30, 40, 50]) {
    const steps = [];
    const q = [...initialData];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: [...q],
      description: `Initial Queue with Front = ${q[0]} and Rear = ${q[q.length - 1]}`,
      codeLine: 1
    }));

    // Demo Enqueue
    const newVal = 60;
    steps.push(createStep({
      type: OP_TYPES.INSERT,
      values: [newVal],
      stateSnapshot: [...q],
      description: `Enqueueing ${newVal} at REAR of queue`,
      codeLine: 3
    }));
    q.push(newVal);

    steps.push(createStep({
      type: OP_TYPES.HIGHLIGHT,
      indices: [q.length - 1],
      values: [newVal],
      stateSnapshot: [...q],
      description: `${newVal} positioned at REAR. Queue length is ${q.length}.`,
      codeLine: 3
    }));

    // Demo Dequeue
    const removed = q.shift();
    steps.push(createStep({
      type: OP_TYPES.DELETE,
      indices: [0],
      values: [removed],
      stateSnapshot: [...q],
      description: `Dequeued ${removed} from FRONT of queue. New Front = ${q[0]}`,
      codeLine: 6
    }));

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: [...q],
      description: `Queue operations complete. Front = ${q[0]}, Rear = ${q[q.length - 1]}`,
      codeLine: 1
    }));

    return steps;
  },

  executeEnqueue(queueData, val = 88) {
    const q = [...queueData];
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.INSERT,
      values: [val],
      stateSnapshot: [...q],
      description: `Enqueueing ${val} at REAR of queue`,
      codeLine: 3
    }));

    q.push(val);

    steps.push(createStep({
      type: OP_TYPES.HIGHLIGHT,
      indices: [q.length - 1],
      stateSnapshot: [...q],
      description: `${val} added to REAR. Queue length is ${q.length}.`,
      codeLine: 3
    }));

    return steps;
  },

  executeDequeue(queueData) {
    const q = [...queueData];
    const steps = [];
    if (q.length === 0) {
      steps.push(createStep({
        type: OP_TYPES.REJECT,
        stateSnapshot: [],
        description: `Queue Underflow: cannot dequeue from empty queue.`,
        codeLine: 6
      }));
      return steps;
    }

    const removed = q[0];
    steps.push(createStep({
      type: OP_TYPES.VISIT,
      indices: [0],
      values: [removed],
      stateSnapshot: [...q],
      description: `FRONT element selected: ${removed}`,
      codeLine: 6
    }));

    q.shift();

    steps.push(createStep({
      type: OP_TYPES.DELETE,
      values: [removed],
      stateSnapshot: [...q],
      description: `Dequeued ${removed} from FRONT.`,
      codeLine: 7
    }));

    return steps;
  }
};

// --- HASH TABLE (WITH CHAINING) ---
export const hashTableOps = {
  id: 'hash-table',
  name: 'Hash Table (Chaining)',
  category: 'structures',
  structureType: 'hashTable',
  complexity: {
    timeBest: 'O(1)',
    timeAverage: 'O(1)',
    timeWorst: 'O(n)',
    space: 'O(n)',
    stable: 'N/A'
  },
  description: 'Associative key-value data structure utilizing a mathematical hash function h(k) = k mod M with linked bucket chaining for collision resolution.',
  code: `function hash(key, bucketCount) {
  return key % bucketCount;
}
function insert(table, key) {
  let bucket = hash(key, 7);
  table[bucket].push(key);
}`,
  execute(initialData) {
    const bucketCount = 7;
    const table = Array.from({ length: bucketCount }, () => []);
    const keysToInsert = [22, 15, 29, 40, 36, 50];
    const steps = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      stateSnapshot: table.map(b => [...b]),
      description: `Initialized empty Hash Table with ${bucketCount} buckets [0..6]`,
      codeLine: 1
    }));

    for (const key of keysToInsert) {
      const bucketIdx = key % bucketCount;

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        indices: [bucketIdx],
        values: [key],
        stateSnapshot: table.map(b => [...b]),
        description: `Hashing key ${key}: h(${key}) = ${key} % ${bucketCount} = Bucket ${bucketIdx}`,
        codeLine: 2
      }));

      table[bucketIdx].push(key);

      steps.push(createStep({
        type: OP_TYPES.INSERT,
        indices: [bucketIdx],
        values: [key],
        stateSnapshot: table.map(b => [...b]),
        description: `Appended ${key} to Bucket ${bucketIdx} (Collisions in bucket: ${table[bucketIdx].length - 1})`,
        codeLine: 5
      }));
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      stateSnapshot: table.map(b => [...b]),
      description: `Hash Table insertion sequence complete!`,
      codeLine: 5
    }));

    return steps;
  },

  executeInsert(tableSnapshot, key = 37, bucketCount = 7) {
    const table = tableSnapshot ? tableSnapshot.map(b => [...b]) : Array.from({ length: bucketCount }, () => []);
    const steps = [];

    const bucketIdx = key % bucketCount;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      values: [key],
      stateSnapshot: table.map(b => [...b]),
      description: `Calculating hash: h(${key}) = ${key} mod ${bucketCount} = Bucket ${bucketIdx}`,
      codeLine: 2,
      extra: { bucketIdx, key }
    }));

    steps.push(createStep({
      type: OP_TYPES.VISIT,
      indices: [bucketIdx],
      values: [key],
      stateSnapshot: table.map(b => [...b]),
      description: `Accessing Bucket [${bucketIdx}]. Current collisions in bucket: ${table[bucketIdx].length}`,
      codeLine: 5,
      extra: { bucketIdx, key }
    }));

    table[bucketIdx].push(key);

    steps.push(createStep({
      type: OP_TYPES.INSERT,
      indices: [bucketIdx],
      values: [key],
      stateSnapshot: table.map(b => [...b]),
      description: `Appended ${key} to Bucket ${bucketIdx} chain.`,
      codeLine: 6,
      extra: { bucketIdx, key }
    }));

    return steps;
  }
};

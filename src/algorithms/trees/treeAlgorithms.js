import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- BST Node Class & Helpers ---
export class TreeNode {
  constructor(val, id = null) {
    this.val = val;
    this.id = id || `node-${val}-${Math.random().toString(36).substr(2, 6)}`;
    this.left = null;
    this.right = null;
    this.height = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
  }
}

// Convert BST/Tree to serializable tree object for visualizer layout
export function serializeTree(root) {
  if (!root) return null;
  return {
    id: root.id,
    val: root.val,
    height: root.height,
    left: serializeTree(root.left),
    right: serializeTree(root.right)
  };
}

// Calculate layout coordinates so nodes never overlap
export function calculateTreeLayout(root, depth = 0, x = 0, spread = 3.5) {
  if (!root) return;
  root.y = -depth * 1.6;
  root.x = x;
  root.z = 0;

  const nextSpread = Math.max(spread * 0.55, 0.9);
  if (root.left) calculateTreeLayout(root.left, depth + 1, x - spread, nextSpread);
  if (root.right) calculateTreeLayout(root.right, depth + 1, x + spread, nextSpread);
}

// --- BINARY SEARCH TREE ---
export const bstOps = {
  id: 'bst',
  name: 'Binary Search Tree',
  category: 'trees',
  structureType: 'tree',
  complexity: {
    timeBest: 'O(log n)',
    timeAverage: 'O(log n)',
    timeWorst: 'O(n)',
    space: 'O(n)',
    stable: 'N/A'
  },
  description: 'Hierarchical node-based data structure where the left subtree contains keys smaller than the node, and the right subtree contains keys greater.',
  code: `function insert(root, val) {
  if (!root) return new Node(val);
  if (val < root.val) {
    root.left = insert(root.left, val);
  } else if (val > root.val) {
    root.right = insert(root.right, val);
  }
  return root;
}`,
  executeInsert(treeRoot, val) {
    const steps = [];
    let root = treeRoot ? cloneTree(treeRoot) : null;

    if (!root) {
      root = new TreeNode(val);
      calculateTreeLayout(root);
      steps.push(createStep({
        type: OP_TYPES.INSERT,
        nodes: [serializeTree(root)],
        values: [val],
        description: `Inserted root node with value ${val}`,
        codeLine: 2
      }));
      return { steps, root };
    }

    let curr = root;
    let parent = null;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      nodes: [serializeTree(root)],
      values: [val],
      description: `Starting BST insertion for key ${val}`,
      codeLine: 1
    }));

    while (curr) {
      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        nodes: [serializeTree(root)],
        values: [curr.val, val],
        description: `Compare insertion value ${val} with current node ${curr.val}`,
        codeLine: 3,
        extra: { activeNodeId: curr.id }
      }));

      parent = curr;
      if (val < curr.val) {
        if (!curr.left) {
          curr.left = new TreeNode(val);
          calculateTreeLayout(root);
          steps.push(createStep({
            type: OP_TYPES.INSERT,
            nodes: [serializeTree(root)],
            values: [val],
            description: `${val} < ${curr.val} => Inserted as left child of ${curr.val}`,
            codeLine: 4,
            extra: { activeNodeId: curr.left.id }
          }));
          break;
        }
        curr = curr.left;
      } else if (val > curr.val) {
        if (!curr.right) {
          curr.right = new TreeNode(val);
          calculateTreeLayout(root);
          steps.push(createStep({
            type: OP_TYPES.INSERT,
            nodes: [serializeTree(root)],
            values: [val],
            description: `${val} > ${curr.val} => Inserted as right child of ${curr.val}`,
            codeLine: 6,
            extra: { activeNodeId: curr.right.id }
          }));
          break;
        }
        curr = curr.right;
      } else {
        steps.push(createStep({
          type: OP_TYPES.REJECT,
          nodes: [serializeTree(root)],
          description: `Value ${val} already exists in BST (Duplicates not permitted).`,
          codeLine: 8
        }));
        break;
      }
    }

    return { steps, root };
  },

  executeTraversal(treeRoot, order = 'inorder') {
    const steps = [];
    const root = treeRoot ? cloneTree(treeRoot) : null;
    if (!root) return steps;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      nodes: [serializeTree(root)],
      description: `Starting ${order.toUpperCase()} tree traversal`,
      codeLine: 1
    }));

    const visited = [];

    function inorder(node) {
      if (!node) return;
      inorder(node.left);
      visited.push(node.val);
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        nodes: [serializeTree(root)],
        values: [node.val],
        description: `Visited Node ${node.val} [Sequence: ${visited.join(' → ')}]`,
        codeLine: 4,
        extra: { activeNodeId: node.id }
      }));
      inorder(node.right);
    }

    function preorder(node) {
      if (!node) return;
      visited.push(node.val);
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        nodes: [serializeTree(root)],
        values: [node.val],
        description: `Visited Node ${node.val} [Sequence: ${visited.join(' → ')}]`,
        codeLine: 3,
        extra: { activeNodeId: node.id }
      }));
      preorder(node.left);
      preorder(node.right);
    }

    function postorder(node) {
      if (!node) return;
      postorder(node.left);
      postorder(node.right);
      visited.push(node.val);
      steps.push(createStep({
        type: OP_TYPES.VISIT,
        nodes: [serializeTree(root)],
        values: [node.val],
        description: `Visited Node ${node.val} [Sequence: ${visited.join(' → ')}]`,
        codeLine: 5,
        extra: { activeNodeId: node.id }
      }));
    }

    if (order === 'preorder') preorder(root);
    else if (order === 'postorder') postorder(root);
    else inorder(root);

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: [serializeTree(root)],
      description: `${order.toUpperCase()} traversal finished! Output: ${visited.join(', ')}`,
      codeLine: 8
    }));

    return steps;
  }
};

// --- AVL TREE (SELF BALANCING) ---
export const avlOps = {
  id: 'avl-tree',
  name: 'AVL Tree (Self-Balancing)',
  category: 'trees',
  structureType: 'tree',
  complexity: {
    timeBest: 'O(log n)',
    timeAverage: 'O(log n)',
    timeWorst: 'O(log n)',
    space: 'O(n)',
    stable: 'N/A'
  },
  description: 'Self-balancing BST where the height difference (balance factor = height(left) - height(right)) of any node is strictly -1, 0, or +1 through rotations.',
  code: `function rightRotate(y) {
  let x = y.left;
  let T2 = x.right;
  x.right = y;
  y.left = T2;
  return x;
}
function leftRotate(x) {
  let y = x.right;
  let T2 = y.left;
  y.left = x;
  x.right = T2;
  return y;
}`,
  executeInsert(treeRoot, val) {
    const steps = [];
    let root = treeRoot ? cloneTree(treeRoot) : null;

    function height(node) {
      return node ? node.height : 0;
    }
    function getBalance(node) {
      return node ? height(node.left) - height(node.right) : 0;
    }

    function rightRotate(y) {
      const x = y.left;
      const T2 = x.right;
      x.right = y;
      y.left = T2;
      y.height = Math.max(height(y.left), height(y.right)) + 1;
      x.height = Math.max(height(x.left), height(x.right)) + 1;
      return x;
    }

    function leftRotate(x) {
      const y = x.right;
      const T2 = y.left;
      y.left = x;
      x.right = T2;
      x.height = Math.max(height(x.left), height(x.right)) + 1;
      y.height = Math.max(height(y.left), height(y.right)) + 1;
      return y;
    }

    function insertAVL(node, key) {
      if (!node) {
        return new TreeNode(key);
      }
      if (key < node.val) {
        node.left = insertAVL(node.left, key);
      } else if (key > node.val) {
        node.right = insertAVL(node.right, key);
      } else {
        return node;
      }

      node.height = 1 + Math.max(height(node.left), height(node.right));
      const balance = getBalance(node);

      // LL Case
      if (balance > 1 && key < node.left.val) {
        steps.push(createStep({
          type: OP_TYPES.ROTATE,
          nodes: [serializeTree(root)],
          description: `RIGHT ROTATION on Node ${node.val} (Balance Factor: ${balance})`,
          codeLine: 1,
          extra: { rotationType: 'RIGHT', nodeVal: node.val, balance }
        }));
        return rightRotate(node);
      }

      // RR Case
      if (balance < -1 && key > node.right.val) {
        steps.push(createStep({
          type: OP_TYPES.ROTATE,
          nodes: [serializeTree(root)],
          description: `LEFT ROTATION on Node ${node.val} (Balance Factor: ${balance})`,
          codeLine: 8,
          extra: { rotationType: 'LEFT', nodeVal: node.val, balance }
        }));
        return leftRotate(node);
      }

      // LR Case
      if (balance > 1 && key > node.left.val) {
        steps.push(createStep({
          type: OP_TYPES.ROTATE,
          nodes: [serializeTree(root)],
          description: `LEFT-RIGHT ROTATION: First Left on ${node.left.val}, then Right on ${node.val}`,
          codeLine: 1,
          extra: { rotationType: 'LEFT-RIGHT', nodeVal: node.val, balance }
        }));
        node.left = leftRotate(node.left);
        return rightRotate(node);
      }

      // RL Case
      if (balance < -1 && key < node.right.val) {
        steps.push(createStep({
          type: OP_TYPES.ROTATE,
          nodes: [serializeTree(root)],
          description: `RIGHT-LEFT ROTATION: First Right on ${node.right.val}, then Left on ${node.val}`,
          codeLine: 8,
          extra: { rotationType: 'RIGHT-LEFT', nodeVal: node.val, balance }
        }));
        node.right = rightRotate(node.right);
        return leftRotate(node);
      }

      return node;
    }

    root = insertAVL(root, val);
    calculateTreeLayout(root);

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: [serializeTree(root)],
      description: `AVL Tree balanced after inserting ${val}. Height: ${root ? root.height : 0}`,
      codeLine: 10
    }));

    return { steps, root };
  }
};

// Deep clone a tree structure
export function cloneTree(root) {
  if (!root) return null;
  const n = new TreeNode(root.val, root.id);
  n.height = root.height;
  n.x = root.x;
  n.y = root.y;
  n.z = root.z;
  n.left = cloneTree(root.left);
  n.right = cloneTree(root.right);
  return n;
}

import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// Default starter graph with 3D aesthetic layout
export function createDefaultGraph() {
  return {
    nodes: [
      { id: 'A', label: 'A', x: -4, y: 1.5, z: 0 },
      { id: 'B', label: 'B', x: -1.5, y: 3.2, z: 1.2 },
      { id: 'C', label: 'C', x: -1.5, y: -1.5, z: -1 },
      { id: 'D', label: 'D', x: 2, y: 2.8, z: -1.2 },
      { id: 'E', label: 'E', x: 2, y: -1.8, z: 1.5 },
      { id: 'F', label: 'F', x: 4.5, y: 0.5, z: 0 }
    ],
    edges: [
      { source: 'A', target: 'B', weight: 4 },
      { source: 'A', target: 'C', weight: 2 },
      { source: 'B', target: 'C', weight: 1 },
      { source: 'B', target: 'D', weight: 5 },
      { source: 'C', target: 'E', weight: 8 },
      { source: 'C', target: 'D', weight: 10 },
      { source: 'D', target: 'E', weight: 2 },
      { source: 'D', target: 'F', weight: 6 },
      { source: 'E', target: 'F', weight: 3 }
    ]
  };
}

// Dijkstra Algorithm
export const dijkstra = {
  id: 'dijkstra',
  name: "Dijkstra's Shortest Path",
  category: 'graphs',
  structureType: 'graph',
  complexity: {
    timeBest: 'O((V + E) log V)',
    timeAverage: 'O((V + E) log V)',
    timeWorst: 'O((V + E) log V)',
    space: 'O(V)',
    stable: 'N/A'
  },
  description: 'Finds the shortest paths between nodes in a graph with non-negative edge weights using a greedy priority exploration.',
  code: `function dijkstra(graph, start, end) {
  let dist = {}, prev = {}, pq = new MinPriorityQueue();
  dist[start] = 0;
  pq.insert(start, 0);

  while (!pq.isEmpty()) {
    let u = pq.extractMin();
    if (u === end) break;
    for (let edge of graph.neighbors(u)) {
      let alt = dist[u] + edge.weight;
      if (alt < (dist[edge.target] ?? Infinity)) {
        dist[edge.target] = alt;
        prev[edge.target] = u;
        pq.insert(edge.target, alt);
      }
    }
  }
  return reconstructPath(prev, end);
}`,
  execute(graph, startId = 'A', endId = 'F') {
    const steps = [];
    const distances = {};
    const previous = {};
    const unvisited = new Set();

    graph.nodes.forEach(node => {
      distances[node.id] = Infinity;
      unvisited.add(node.id);
    });
    distances[startId] = 0;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      description: `Initialize Dijkstra from start node ${startId} to destination ${endId}. Initial distance = 0`,
      codeLine: 2
    }));

    while (unvisited.size > 0) {
      // Find unvisited node with smallest distance
      let curr = null;
      let minDist = Infinity;
      for (const node of unvisited) {
        if (distances[node] < minDist) {
          minDist = distances[node];
          curr = node;
        }
      }

      if (!curr || minDist === Infinity) break;

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        nodes: [curr],
        description: `Selected node ${curr} with minimum distance ${minDist}`,
        codeLine: 7,
        extra: { distances: { ...distances } }
      }));

      unvisited.delete(curr);

      if (curr === endId) {
        steps.push(createStep({
          type: OP_TYPES.MESSAGE,
          nodes: [curr],
          description: `Target destination ${endId} reached with total distance ${distances[endId]}!`,
          codeLine: 8
        }));
        break;
      }

      // Check all neighbors
      const neighbors = graph.edges.filter(e => e.source === curr || e.target === curr);

      for (const edge of neighbors) {
        const neighbor = edge.source === curr ? edge.target : edge.source;
        if (!unvisited.has(neighbor)) continue;

        const newDist = distances[curr] + edge.weight;

        steps.push(createStep({
          type: OP_TYPES.COMPARE,
          nodes: [curr, neighbor],
          edges: [`${edge.source}-${edge.target}`],
          description: `Evaluating edge (${curr} -> ${neighbor}, weight: ${edge.weight}). Candidate distance = ${distances[curr]} + ${edge.weight} = ${newDist}`,
          codeLine: 10,
          extra: { distances: { ...distances } }
        }));

        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = curr;

          steps.push(createStep({
            type: OP_TYPES.HIGHLIGHT,
            nodes: [neighbor],
            edges: [`${edge.source}-${edge.target}`],
            description: `Updated shortest distance to ${neighbor}: ${newDist}`,
            codeLine: 12,
            extra: { distances: { ...distances } }
          }));
        }
      }
    }

    // Reconstruct shortest path
    const path = [];
    let curr = endId;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }

    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      pathEdges.push(`${path[i]}-${path[i+1]}`);
    }

    steps.push(createStep({
      type: OP_TYPES.PATH_FOUND,
      nodes: path,
      edges: pathEdges,
      description: `Shortest Path: ${path.join(' ➔ ')} (Total Weight: ${distances[endId]})`,
      codeLine: 18,
      extra: { path, totalCost: distances[endId] }
    }));

    return steps;
  }
};

// BFS Traversal
export const bfs = {
  id: 'bfs',
  name: 'Breadth-First Search (BFS)',
  category: 'graphs',
  structureType: 'graph',
  complexity: {
    timeBest: 'O(V + E)',
    timeAverage: 'O(V + E)',
    timeWorst: 'O(V + E)',
    space: 'O(V)',
    stable: 'N/A'
  },
  description: 'Explores graph layer-by-layer starting from a source node, utilizing a FIFO queue to discover nearest neighbors first.',
  code: `function bfs(graph, start) {
  let queue = [start];
  let visited = new Set([start]);
  while (queue.length > 0) {
    let node = queue.shift();
    visit(node);
    for (let neighbor of graph.neighbors(node)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}`,
  execute(graph, startId = 'A') {
    const steps = [];
    const queue = [startId];
    const visited = new Set([startId]);
    const traversalOrder = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      nodes: [startId],
      description: `Enqueue root source node ${startId}`,
      codeLine: 2
    }));

    while (queue.length > 0) {
      const curr = queue.shift();
      traversalOrder.push(curr);

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        nodes: [curr],
        description: `Dequeued and visiting Node ${curr} [Order: ${traversalOrder.join(' → ')}]`,
        codeLine: 5
      }));

      const edges = graph.edges.filter(e => e.source === curr || e.target === curr);

      for (const edge of edges) {
        const neighbor = edge.source === curr ? edge.target : edge.source;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);

          steps.push(createStep({
            type: OP_TYPES.HIGHLIGHT,
            nodes: [neighbor],
            edges: [`${edge.source}-${edge.target}`],
            description: `Discovered neighbor ${neighbor} via edge (${curr}-${neighbor}), added to Queue`,
            codeLine: 9
          }));
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: traversalOrder,
      description: `BFS Traversal Finished! Visited ${traversalOrder.length} nodes.`,
      codeLine: 13
    }));

    return steps;
  }
};

// DFS Traversal
export const dfs = {
  id: 'dfs',
  name: 'Depth-First Search (DFS)',
  category: 'graphs',
  structureType: 'graph',
  complexity: {
    timeBest: 'O(V + E)',
    timeAverage: 'O(V + E)',
    timeWorst: 'O(V + E)',
    space: 'O(V)',
    stable: 'N/A'
  },
  description: 'Explores as far as possible along each branch before backtracking using recursive stack execution.',
  code: `function dfs(graph, start) {
  let visited = new Set();
  function explore(node) {
    visited.add(node);
    visit(node);
    for (let neighbor of graph.neighbors(node)) {
      if (!visited.has(neighbor)) {
        explore(neighbor);
      }
    }
  }
  explore(start);
}`,
  execute(graph, startId = 'A') {
    const steps = [];
    const visited = new Set();
    const traversalOrder = [];

    function explore(node) {
      visited.add(node);
      traversalOrder.push(node);

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        nodes: [node],
        description: `Explore Node ${node} [Stack depth: ${visited.size}]`,
        codeLine: 5
      }));

      const edges = graph.edges.filter(e => e.source === node || e.target === node);
      for (const edge of edges) {
        const neighbor = edge.source === node ? edge.target : edge.source;
        if (!visited.has(neighbor)) {
          steps.push(createStep({
            type: OP_TYPES.COMPARE,
            nodes: [node, neighbor],
            edges: [`${edge.source}-${edge.target}`],
            description: `Traverse edge (${node} -> ${neighbor}) deeper into branch`,
            codeLine: 8
          }));
          explore(neighbor);
        }
      }
    }

    explore(startId);

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: traversalOrder,
      description: `DFS Traversal Finished! Output: ${traversalOrder.join(' → ')}`,
      codeLine: 12
    }));

    return steps;
  }
};

// Prim's Minimum Spanning Tree
export const prim = {
  id: 'prim',
  name: "Prim's Minimum Spanning Tree",
  category: 'graphs',
  structureType: 'graph',
  complexity: {
    timeBest: 'O(E log V)',
    timeAverage: 'O(E log V)',
    timeWorst: 'O(E log V)',
    space: 'O(V)',
    stable: 'N/A'
  },
  description: 'Greedy algorithm that finds a minimum spanning tree for a weighted undirected graph by starting from a node and adding the lowest weight edge connecting the tree to a new node.',
  code: `function prim(graph, start) {
  let mst = [], inTree = new Set([start]);
  while (inTree.size < graph.nodes.length) {
    let minEdge = findLowestWeightCutEdge(inTree, graph.edges);
    inTree.add(minEdge.target);
    mst.push(minEdge);
  }
  return mst;
}`,
  execute(graph, startId = 'A') {
    const steps = [];
    const inTree = new Set([startId]);
    const mstEdges = [];
    let totalWeight = 0;

    steps.push(createStep({
      type: OP_TYPES.VISIT,
      nodes: [startId],
      description: `Initialize MST starting with Node ${startId}`,
      codeLine: 2
    }));

    while (inTree.size < graph.nodes.length) {
      let minEdge = null;
      let minWeight = Infinity;

      for (const edge of graph.edges) {
        const uIn = inTree.has(edge.source);
        const vIn = inTree.has(edge.target);

        if ((uIn && !vIn) || (!uIn && vIn)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }

      if (!minEdge) break;

      const newVertex = inTree.has(minEdge.source) ? minEdge.target : minEdge.source;
      inTree.add(newVertex);
      mstEdges.push(`${minEdge.source}-${minEdge.target}`);
      totalWeight += minEdge.weight;

      steps.push(createStep({
        type: OP_TYPES.PATH_FOUND,
        nodes: Array.from(inTree),
        edges: [...mstEdges],
        description: `Add edge (${minEdge.source}-${minEdge.target}, weight: ${minEdge.weight}) to MST. Connected node: ${newVertex}`,
        codeLine: 5
      }));
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: Array.from(inTree),
      edges: mstEdges,
      description: `Minimum Spanning Tree complete! Total MST Weight = ${totalWeight}`,
      codeLine: 7,
      extra: { totalWeight }
    }));

    return steps;
  }
};

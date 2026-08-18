import { OP_TYPES, createStep } from '../engine/ExecutionEngine.js';

// --- BELLMAN-FORD SHORTEST PATH ---
export const bellmanFord = {
  id: 'bellman-ford',
  name: "Bellman-Ford Shortest Path",
  category: 'graphs',
  structureType: 'graph',
  complexity: { timeBest: 'O(E)', timeAverage: 'O(V * E)', timeWorst: 'O(V * E)', space: 'O(V)' },
  description: 'Computes shortest paths from a single source vertex to all other vertices in a weighted digraph, capable of handling negative edge weights and detecting negative weight cycles.',
  code: `function bellmanFord(graph, src) {
  let dist = {};
  for (let node of graph.nodes) dist[node.id] = Infinity;
  dist[src] = 0;
  for (let i = 1; i < graph.nodes.length; i++) {
    for (let edge of graph.edges) {
      if (dist[edge.source] + edge.weight < dist[edge.target]) {
        dist[edge.target] = dist[edge.source] + edge.weight;
      }
    }
  }
  return dist;
}`,
  execute(graph, startId = 'A', endId = 'F') {
    const steps = [];
    const dist = {};
    const V = graph.nodes.length;

    graph.nodes.forEach(n => { dist[n.id] = Infinity; });
    dist[startId] = 0;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      description: `Bellman-Ford initialized from source node ${startId}. Running |V| - 1 = ${V - 1} relaxation passes`,
      variables: { source: startId, passes: V - 1 },
      codeLine: 2
    }));

    for (let pass = 1; pass < V; pass++) {
      let updated = false;

      steps.push(createStep({
        type: OP_TYPES.MESSAGE,
        description: `--- Pass ${pass} of ${V - 1} ---`,
        variables: { currentPass: pass },
        codeLine: 5
      }));

      for (const edge of graph.edges) {
        const u = edge.source;
        const v = edge.target;
        const wt = edge.weight;

        if (dist[u] !== Infinity && dist[u] + wt < dist[v]) {
          dist[v] = dist[u] + wt;
          updated = true;

          steps.push(createStep({
            type: OP_TYPES.RELAX,
            nodes: [v],
            edges: [`${u}-${v}`],
            description: `Relax edge (${u} -> ${v}, wt: ${wt}). Updated dist[${v}] = ${dist[v]}`,
            variables: { u, v, weight: wt, newDist: dist[v] },
            codeLine: 7
          }));
        }
      }

      if (!updated) {
        steps.push(createStep({
          type: OP_TYPES.MESSAGE,
          description: `Early convergence at pass ${pass}. No further distances improved.`,
          codeLine: 5
        }));
        break;
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: [startId, endId],
      description: `Bellman-Ford complete! Shortest distance to destination ${endId} = ${dist[endId]}`,
      variables: { destinationDistance: dist[endId] },
      codeLine: 11
    }));

    return steps;
  }
};

// --- KRUSKAL'S MINIMUM SPANNING TREE ---
export const kruskal = {
  id: 'kruskal',
  name: "Kruskal's Minimum Spanning Tree",
  category: 'graphs',
  structureType: 'graph',
  complexity: { timeBest: 'O(E log E)', timeAverage: 'O(E log E)', timeWorst: 'O(E log E)', space: 'O(V + E)' },
  description: 'Finds a minimum spanning forest by sorting all edges by weight, then greedily adding edges that connect two disjoint trees using a Union-Find data structure.',
  code: `function kruskal(graph) {
  let sortedEdges = [...graph.edges].sort((a,b) => a.weight - b.weight);
  let dsu = new DSU(graph.nodes);
  let mst = [];
  for (let edge of sortedEdges) {
    if (dsu.union(edge.source, edge.target)) {
      mst.push(edge);
    }
  }
  return mst;
}`,
  execute(graph) {
    const steps = [];
    const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);
    const parent = {};
    graph.nodes.forEach(n => { parent[n.id] = n.id; });

    function find(i) {
      if (parent[i] === i) return i;
      return (parent[i] = find(parent[i]));
    }

    function union(i, j) {
      const rootI = find(i);
      const rootJ = find(j);
      if (rootI !== rootJ) {
        parent[rootI] = rootJ;
        return true;
      }
      return false;
    }

    const mstEdges = [];
    let totalWeight = 0;

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      description: `Edges sorted by weight: [${sortedEdges.map(e => e.weight).join(', ')}]`,
      codeLine: 2
    }));

    for (const edge of sortedEdges) {
      const edgeKey = `${edge.source}-${edge.target}`;

      steps.push(createStep({
        type: OP_TYPES.COMPARE,
        edges: [edgeKey],
        description: `Evaluate candidate edge (${edge.source}-${edge.target}, wt: ${edge.weight})`,
        variables: { edge: edgeKey, weight: edge.weight },
        codeLine: 5
      }));

      if (union(edge.source, edge.target)) {
        mstEdges.push(edgeKey);
        totalWeight += edge.weight;

        steps.push(createStep({
          type: OP_TYPES.EDGE_ACCEPT,
          edges: [...mstEdges],
          description: `Accepted edge (${edge.source}-${edge.target}) into MST! (No cycle formed)`,
          variables: { acceptedEdge: edgeKey, totalWeight },
          codeLine: 6
        }));
      } else {
        steps.push(createStep({
          type: OP_TYPES.EDGE_REJECT,
          edges: [edgeKey],
          description: `Rejected edge (${edge.source}-${edge.target}) - would create a cycle!`,
          variables: { rejectedEdge: edgeKey },
          codeLine: 5
        }));
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      edges: mstEdges,
      description: `Kruskal MST Complete! Total MST Weight = ${totalWeight}`,
      variables: { totalMSTWeight: totalWeight, edgeCount: mstEdges.length },
      codeLine: 9
    }));

    return steps;
  }
};

// --- TOPOLOGICAL SORT (KAHN'S ALGORITHM) ---
export const topologicalSort = {
  id: 'topological-sort',
  name: 'Topological Sort (Kahn / In-Degree)',
  category: 'graphs',
  structureType: 'graph',
  complexity: { timeBest: 'O(V + E)', timeAverage: 'O(V + E)', timeWorst: 'O(V + E)', space: 'O(V)' },
  description: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u->v, vertex u comes before v using in-degree reduction.',
  code: `function kahnTopoSort(graph) {
  let inDegree = {}, queue = [], order = [];
  for (let n of graph.nodes) inDegree[n.id] = 0;
  for (let e of graph.edges) inDegree[e.target]++;
  for (let n of graph.nodes) if (inDegree[n.id] === 0) queue.push(n.id);
  while (queue.length > 0) {
    let u = queue.shift();
    order.push(u);
    for (let edge of graph.outgoing(u)) {
      if (--inDegree[edge.target] === 0) queue.push(edge.target);
    }
  }
  return order;
}`,
  execute(graph) {
    const steps = [];
    const inDegree = {};
    graph.nodes.forEach(n => { inDegree[n.id] = 0; });
    graph.edges.forEach(e => { if (inDegree[e.target] !== undefined) inDegree[e.target]++; });

    const queue = [];
    graph.nodes.forEach(n => {
      if (inDegree[n.id] === 0) queue.push(n.id);
    });

    const order = [];

    steps.push(createStep({
      type: OP_TYPES.MESSAGE,
      description: `Calculated in-degrees. Vertices with 0 in-degree: [${queue.join(', ')}]`,
      variables: { inDegrees: { ...inDegree }, initialQueue: [...queue] },
      codeLine: 4
    }));

    while (queue.length > 0) {
      const u = queue.shift();
      order.push(u);

      steps.push(createStep({
        type: OP_TYPES.VISIT,
        nodes: [u],
        description: `Dequeue node ${u} (in-degree = 0) and append to topological order`,
        variables: { processedNode: u, currentOrder: [...order] },
        codeLine: 7
      }));

      const outgoing = graph.edges.filter(e => e.source === u);
      for (const edge of outgoing) {
        inDegree[edge.target]--;

        steps.push(createStep({
          type: OP_TYPES.DEQUEUE_NODE,
          edges: [`${edge.source}-${edge.target}`],
          nodes: [edge.target],
          description: `Decremented in-degree of ${edge.target} to ${inDegree[edge.target]}`,
          variables: { targetNode: edge.target, newInDegree: inDegree[edge.target] },
          codeLine: 9
        }));

        if (inDegree[edge.target] === 0) {
          queue.push(edge.target);
          steps.push(createStep({
            type: OP_TYPES.ENQUEUE_NODE,
            nodes: [edge.target],
            description: `Node ${edge.target} in-degree reached 0. Added to queue.`,
            variables: { enqueued: edge.target },
            codeLine: 9
          }));
        }
      }
    }

    steps.push(createStep({
      type: OP_TYPES.COMPLETE,
      nodes: order,
      description: `Topological Order Finished: ${order.join(' ➔ ')}`,
      variables: { finalOrder: order },
      codeLine: 12
    }));

    return steps;
  }
};

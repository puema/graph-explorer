import { group, index } from 'd3-array';
import data from '../data.json';
import { Edge, Graph, Node } from './types';

const { nodes: rawNodes, edges: rawEdges } = data as Graph;

interface Context {
  nodes: Node[];
  edges: Edge[];
  rootIds: string[];
  sourceIdToEdges: Map<string, Edge[]>;
  idToNode: Map<string, Node>;
  depth: number;
  flattenVisible(): { nodes: Node[]; edges: Edge[] };
  toggleAll(): void;
}

export const state = createState();

export function createState() {
  const nodes = [...rawNodes];
  const edges = [...rawEdges];

  const context = {
    nodes,
    edges,
    rootIds: getRootIds(nodes, edges),
    sourceIdToEdges: group(edges, (edge) => edge.source) as Map<string, Edge[]>,
    idToNode: index(nodes, (node) => node.id),
    depth: 0,
    traverse,
    flattenVisible,
    toggleAll,
  };

  context.traverse();

  for (const node of nodes) {
    node.depth = context.depth;
    if (!context.sourceIdToEdges.has(node.id)) {
      node.isLeafNode = true;
    }
  }

  return {
    flattenVisible: () => context.flattenVisible(),
    toggleAll: () => context.toggleAll(),
  };
}

function toggleAll(this: Context) {
  for (const node of this.nodes) {
    node.isCollapsed = !node.isCollapsed;
  }
}

function getRootIds(nodes: Node[], edges: Edge[]) {
  const nodesInDegree: { [id: string]: number } = nodes.reduce(
    (res, { id }) => ({ ...res, [id]: 0 }),
    {}
  );

  for (const { target } of edges as {
    source: string;
    target: string;
  }[]) {
    const nodeInDegree = nodesInDegree[target];
    nodesInDegree[target] = (nodeInDegree || 0) + 1;
  }

  return Object.entries(nodesInDegree)
    .filter(([, value]) => value === 0)
    .map(([key]) => key);
}

function traverse(this: Context) {
  const visited = new Set<string>();

  const recurse = (node: Node, level = 0) => {
    const { id } = node;
    if (visited.has(id)) return;
    node.level = level;
    visited.add(id);
    const currentEdges = this.sourceIdToEdges.get(id) ?? [];
    for (const edge of currentEdges) {
      const child = this.idToNode.get(edge.target as string)!;
      recurse(child, (this.depth = Math.max(level + 1)));
    }
  };

  for (const rootId of this.rootIds) {
    const rootNode = this.idToNode.get(rootId)!;
    recurse(rootNode);
  }
}

function flattenVisible(this: Context) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const visited = new Set<string>();

  const recurse = (node: Node) => {
    const { id, isCollapsed } = node;
    if (visited.has(id)) return;
    nodes.push(node);
    visited.add(id);
    if (!isCollapsed) {
      const currentEdges = this.sourceIdToEdges.get(id) ?? [];
      for (const edge of currentEdges) {
        const child =
          typeof edge.target === 'string'
            ? this.idToNode.get(edge.target)!
            : (edge.target as Node);
        edges.push(edge);
        recurse(child);
      }
    }
  };

  for (const rootId of this.rootIds) {
    const rootNode = this.idToNode.get(rootId)!;
    recurse(rootNode);
  }

  return { nodes, edges };
}

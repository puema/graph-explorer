import { group, index, rollup } from 'd3-array';
import data from './data.json';
import { Node, Edge, Graph } from './types';

const { nodes: rawNodes, edges: rawEdges } = data as Graph;

interface InternalData {
  nodes: Node[];
  edges: Edge[];
  rootIds: string[];
  sourceIdToEdges: Map<string, Edge[]>;
  idToNode: Map<string, Node>;
  depth: number;
  flattenVisible(): { nodes: Node[]; edges: Edge[] };
}

export function createData() {
  const nodes = [...rawNodes];
  const edges = [...rawEdges];

  const sourceIdToEdges = group(edges, (edge) => edge.source) as Map<
    string,
    Edge[]
  >;

  const idToNode = index(nodes, (node) => node.id);

  const rootIds = getRootIds(nodes, edges);

  const context = {
    nodes,
    edges,
    rootIds,
    sourceIdToEdges,
    idToNode,
    depth: 0,
    traverse,
    flattenVisible,
  };

  context.traverse();

  for (const node of nodes) {
    node.depth = context.depth;
    if (!sourceIdToEdges.has(node.id)) {
      node.isLeafNode = true;
    }
  }

  return {
    flattenVisible: () => context.flattenVisible(),
  };
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

function traverse(this: InternalData) {
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

function flattenVisible(this: InternalData) {
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

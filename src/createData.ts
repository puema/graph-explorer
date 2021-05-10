import { group, index, rollup } from 'd3-array';
import data from './data.json';
import { Node, Edge, Graph } from './types';

const { nodes: rawNodes, edges: rawEdges } = data as Graph;

interface DataSource {
  nodes: Node[];
  edges: Edge[];
  rootIds: string[];
  sourceIdToEdges: Map<string, Edge[]>;
  idToNode: Map<string, Node>;
  flattenVisible(): { nodes: Node[]; edges: Edge[] };
  children(id: string): Node[];
}

export function createData(): DataSource {
  const nodes = [...rawNodes];
  const edges = [...rawEdges];

  const sourceIdToEdges = group(edges, (edge) => edge.source) as Map<
    string,
    Edge[]
  >;

  const idToNode = index(nodes, (node) => node.id);

  const rootIds = getRootIds(nodes, edges);

  for (const node of nodes) {
    if (!sourceIdToEdges.has(node.id)) {
      node.isLeafNode = true;
    }
  }

  return {
    nodes,
    edges,
    rootIds,
    sourceIdToEdges,
    idToNode,
    flattenVisible,
    children,
  };
}

function children(this: DataSource, id: string) {
  const childNodes: Node[] = [];
  for (const childId of (this.sourceIdToEdges
    .get(id)
    ?.map(({ target }) => target) ?? []) as string[]) {
    childNodes.push(this.idToNode.get(childId)!);
  }
  return childNodes;
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

function flattenVisible(this: DataSource) {
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
        const child = edge.target as Node;
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

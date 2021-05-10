import { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

export interface NodeData {
  name: string;
  description?: string;
}

export interface Node extends SimulationNodeDatum {
  id: string;
  data?: NodeData;
  isCollapsed?: boolean;
  isLeafNode?: boolean;
  level?: number;
  depth?: number;
}

export interface Edge extends SimulationLinkDatum<Node> {
  isCollapsed?: boolean;
}

export interface SimulatedEdge extends Edge {
  source: Node;
  target: Node;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

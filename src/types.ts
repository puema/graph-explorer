import { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

export interface NodeData {
  name: string;
  description?: string;
}

export interface Node extends SimulationNodeDatum {
  id: string;
  data: NodeData;
}

export interface Edge extends SimulationLinkDatum<Node> {}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

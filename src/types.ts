import { SimulationLinkDatum, SimulationNodeDatum } from 'd3-force';

export interface Node extends SimulationNodeDatum {
  id: string;
  description: string;
}

export interface Edge extends SimulationLinkDatum<Node> {}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

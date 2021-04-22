import { SimulationNodeDatum } from 'd3-force';

export interface Node extends SimulationNodeDatum {
  id: string;
}

export interface Edge {
  source: string;
  target: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}

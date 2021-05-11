import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import { Edge, Node } from './types';

export const width = window.innerWidth;
export const height = window.innerHeight;
export const padding = 64;

export const simulation = forceSimulation<Node>()
  .force(
    'link',
    forceLink<Node, Edge>()
      .id((d) => d.id)
      .distance(64)
  )
  // .force('collision', forceCollide().radius(16))
  .force('charge', forceManyBody().strength(-300))
  .force(
    'x',
    forceX()
      .x(width / 2)
      .strength(0.01)
  )
  .force(
    'y',
    forceY()
      .y(height / 2)
      .strength(0.01)
  )
  .force('center', forceCenter(width / 2, height / 2).strength(1));

import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  SimulationNodeDatum,
} from 'd3-force';
import { select } from 'd3-selection';

import data from './data.json';
import { Graph, Node, Edge } from './types';

const { nodes, edges } = data as Graph;

export function createGraph() {
  const simulation = forceSimulation<Node>(nodes)
    .force(
      'link',
      forceLink<Node, Edge>(edges).id((d) => d.id)
    )
    .force('charge', forceManyBody())
    .force(
      'center',
      forceCenter(document.body.offsetWidth / 2, document.body.offsetHeight / 2)
    );

  const nodeElements = select('body')
    .selectAll('graph-node')
    .data(nodes)
    .enter()
    .append('graph-node')
    .attr('data-id', (d) => d.id);

  simulation.on('tick', () => {
    nodeElements
      .style('left', (d) => d.x + 'px')
      .style('top', (d) => d.y + 'px');
  });
}

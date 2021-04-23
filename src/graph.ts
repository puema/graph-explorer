import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
  Simulation,
  SimulationNodeDatum,
} from 'd3-force';
import { drag } from 'd3-drag';
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

  const addDrag = (simulation: Simulation<Node, undefined>) => {
    function handleStart(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function handleDrag(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function handleEnd(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return drag()
      .on('start', handleStart)
      .on('drag', handleDrag)
      .on('end', handleEnd);
  };

  const nodeElements = select('body')
    .selectAll('graph-node')
    .data(nodes)
    .enter()
    .append('graph-node')
    .attr('data-id', (d) => d.id)
    .call(addDrag(simulation) as any);

  simulation.on('tick', () => {
    nodeElements
      .style('left', (d) => d.x + 'px')
      .style('top', (d) => d.y + 'px');
  });
}

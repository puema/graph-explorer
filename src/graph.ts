import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { select } from 'd3-selection';

import data from './data.json';
import drag from './drag';
import { Edge, Graph, Node } from './types';
import renderNode from './renderNode';

const { nodes, edges } = data as Graph;

export function createGraph() {
  const simulation = forceSimulation<Node>(nodes)
    .force(
      'link',
      forceLink<Node, Edge>(edges)
        .id((d) => d.id)
        .distance(64)
    )
    .force('charge', forceManyBody().strength(-200))
    .force(
      'center',
      forceCenter(document.body.offsetWidth / 2, document.body.offsetHeight / 2)
    );

  const nodeElements = select('body')
    .selectAll('node')
    .data(nodes)
    .enter()
    .append<HTMLElement>('node')
    .property('id', (d) => d.id)
    .property('description', (d) => d.description)
    .on('click', handleClick)
    .each(renderNode)
    .call(drag(simulation) as any);

  const strokes = select('svg')
    .append('g')
    .attr('stroke', '#fff')
    .attr('stroke-opacity', 0.6)
    .selectAll('line')
    .data(edges)
    .join('line');

  function handleClick(event: any) {
    if (event.defaultPrevented) return;
  }

  simulation.on('tick', () => {
    nodeElements
      .style('left', (d) => d.x + 'px')
      .style('top', (d) => d.y + 'px');

    strokes
      .attr('x1', (d) => (d.source as any).x)
      .attr('y1', (d) => (d.source as any).y)
      .attr('x2', (d) => (d.target as any).x)
      .attr('y2', (d) => (d.target as any).y);
  });
}

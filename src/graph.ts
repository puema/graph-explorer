import { ForceLink } from 'd3-force';
import { select } from 'd3-selection';

import drag from './drag';
import { Edge, Node } from './types';
import renderNode from './renderNode';
import { createData } from './createData';
import { height, padding, simulation, width } from './simulation';

const data = createData();

export function renderGraph() {
  const { nodes, edges } = data.flattenVisible();

  function handleClick(event: any, node: Node) {
    node.isCollapsed = !node.isCollapsed;
    renderGraph();
  }

  const nodeSelection = select('body')
    .selectAll<HTMLElement, Node>('node')
    .data(nodes, ({ id }) => id)
    .join<HTMLElement>('node')
    .on('click', handleClick)
    .each(renderNode)
    .call(drag(simulation) as any);

  const edgeSelection = select('svg')
    .selectAll('line')
    .data<Edge>(edges)
    .join('line');

  simulation.on('tick', () => {
    const clampX = (x: number = 0) =>
      Math.min(width - padding, Math.max(padding, x));
    const clampY = (y: number = 0) =>
      Math.min(height - padding, Math.max(padding, y));

    nodeSelection
      .style('left', (d) => (d.x = clampX(d.x)) + 'px')
      .style('top', (d) => (d.y = clampY(d.y)) + 'px');

    edgeSelection
      .attr('x1', (d) => (d.source as any).x)
      .attr('y1', (d) => (d.source as any).y)
      .attr('x2', (d) => (d.target as any).x)
      .attr('y2', (d) => (d.target as any).y);
  });

  simulation.nodes(nodes);
  (simulation.force('link') as ForceLink<Node, Edge>).links(edges);
  simulation.alpha(1.3).restart();
}

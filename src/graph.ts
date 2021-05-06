import {
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force';
import { select } from 'd3-selection';
import { rollup } from 'd3-array';

import data from './data.json';
import drag from './drag';
import { Edge, Graph, Node, SimulatedEdge } from './types';
import renderNode from './renderNode';
import { getDescendants } from './graphUtils';

const { nodes, edges } = data as Graph;
const childNodesMap = rollup(
  edges,
  (children) => children.map(({ target }) => target),
  (edge) => edge.source
) as Map<string, string[]>;

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

export function renderGraph() {
  const nodeElements = select('body')
    .selectAll<HTMLElement, Node>('node')
    .data(nodes.filter(({ isCollapsed }) => !isCollapsed))
    .join<HTMLElement>('node')
    .on('click', handleClick)
    .each(renderNode)
    .call(drag(simulation) as any);

  const strokes = select('svg')
    .selectAll('line')
    .data<Edge>(edges.filter(({ isCollapsed }) => !isCollapsed))
    .join('line');

  function handleClick(event: any, { id }: Node) {
    const descendants = getDescendants(id, childNodesMap);
    nodes.forEach((node) => {
      if (descendants.has(node.id)) {
        node.isCollapsed = !node.isCollapsed;
      }
    });
    (edges as SimulatedEdge[]).forEach((edge) => {
      if (descendants.has(edge.target.id)) {
        edge.isCollapsed = !edge.isCollapsed;
      }
    });
    renderGraph();
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

import {
  forceCenter,
  forceCollide,
  ForceLink,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from 'd3-force';
import { select } from 'd3-selection';
import drag from './drag';
import { Edge, Node } from './types';
import renderNode from './renderNode';
import { createData } from './createData';

const data = createData();

const width = document.body.offsetWidth;
const height = document.body.offsetHeight;
const padding = 64;

const simulation = forceSimulation<Node>(data.nodes)
  .force(
    'link',
    forceLink<Node, Edge>(data.edges)
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

export function renderGraph() {
  const { nodes, edges } = data.flattenVisible();

  function handleClick(event: any, node: Node) {
    node.isCollapsed = !node.isCollapsed;
    renderGraph();
  }

  const nodeElements = select('body')
    .selectAll<HTMLElement, Node>('node')
    .data(nodes, ({ id }) => id)
    .join<HTMLElement>('node')
    .on('click', handleClick)
    .each(renderNode)
    .call(drag(simulation) as any);

  const strokes = select('svg')
    .selectAll('line')
    .data<Edge>(edges)
    .join('line');

  simulation.on('tick', () => {
    const clampX = (x: number = 0) =>
      Math.min(width - padding, Math.max(padding, x));
    const clampY = (y: number = 0) =>
      Math.min(height - padding, Math.max(padding, y));

    nodeElements
      .style('left', (d) => (d.x = clampX(d.x)) + 'px')
      .style('top', (d) => (d.y = clampY(d.y)) + 'px');

    strokes
      .attr('x1', (d) => (d.source as any).x)
      .attr('y1', (d) => (d.source as any).y)
      .attr('x2', (d) => (d.target as any).x)
      .attr('y2', (d) => (d.target as any).y);
  });

  simulation.nodes(nodes);
  (simulation.force('link') as ForceLink<Node, Edge>).links(edges);
  simulation.alpha(1.3).restart();
}

import { select } from 'd3-selection';

const data = ['react', 'angular', 'vue'];

export function createGraph() {
  select('body')
    .selectAll('graph-node')
    .data(data)
    .enter()
    .append('graph-node')
    .text((d) => d);
}

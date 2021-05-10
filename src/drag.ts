import { Simulation } from 'd3-force';
import { Node } from './types';
import { drag } from 'd3-drag';

export default function (simulation: Simulation<Node, undefined>) {
  function handleStart(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function handleDrag(event: any) {
    console.log('debug handleDrag, line 13:', event)
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
}

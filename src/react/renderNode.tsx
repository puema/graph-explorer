import { Node } from '../d3/types';
import { render } from 'react-dom';
import React from 'react';

import NodeComponent from './Node';

export default function renderNode(
  this: HTMLElement,
  node: Node,
  index: number
) {
  const props = {
    host: this,
    index,
    ...node,
  };

  render(<NodeComponent {...props} />, this);
}

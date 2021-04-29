import { Node } from './types';
import { render } from 'react-dom';
import React from 'react';

import NodeComponent from './Node';

export default function renderNode(this: HTMLElement, node: Node) {
  const props = {
    host: this,
    ...node,
  };

  render(<NodeComponent {...props} />, this);
}

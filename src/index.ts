import { select } from 'd3-selection';
import { css, injectGlobal } from '@emotion/css';

import { renderGraph } from './d3/graph';
import { state } from './d3/state';

injectGlobal`
  body {
    background-color: #121212;
    color: #b3b3b3;
    font-family: 'Open Sans', Roboto, 'Helvetica Neue', sans-serif;
    margin: 0;
  }
  
  button {
    background-color: #ffacac;
    box-shadow: 0 0 8px 4px rgb(255, 172, 172, 0.5);
    border-radius: 99px;
    border: none;
    color: #121212;
    padding: 8px 16px;
  }
`;

const svg = css`
  stroke: #ffffff;
  stroke-opacity: 0.6;
`;

const collapse = css`
  position: fixed;
  top: 16px;
  left: 16px;
`;

const body = select('body');

body
  .append('button')
  .text('COLLAPSE ALL')
  .attr('class', collapse)
  .on('click', () => {
    state.toggleAll();
    renderGraph();
  });

body
  .append('svg')
  .attr('width', '100vw')
  .attr('height', '100vh')
  .attr('class', svg);

renderGraph();

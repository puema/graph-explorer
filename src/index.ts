import { select } from 'd3-selection';
import { css, injectGlobal } from '@emotion/css';

import { createGraph } from './graph';

injectGlobal`
  body {
    background-color: #121212;
    color: #b3b3b3;
    font-family: 'Open Sans', Roboto, 'Helvetica Neue', sans-serif;
    margin: 0;
  }
  
  button {
    background-color: #282828;
    border-radius: 99px;
    border: none;
    color: #eeeeee;
    padding: 8px 16px;
  }
`;

const svg = css``;

const body = select('body');

body
  .append('svg')
  .attr('width', '100vw')
  .attr('height', '100vh')
  .attr('class', svg);

createGraph();

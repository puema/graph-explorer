import { select } from 'd3-selection';
import { css } from '@emotion/css';

import './node';
import { createGraph } from './graph';

const body = css`
  background-color: #121212;
  color: #b3b3b3;
  font-family: 'Open Sans', Roboto, 'Helvetica Neue', sans-serif;
`;

select('body').attr('class', body);
select('button').on('click', createGraph);

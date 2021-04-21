import { select } from 'd3-selection';

import './node';
import { createGraph } from './graph';

select('button').on('click', createGraph);

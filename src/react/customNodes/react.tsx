import { useState } from 'react';
import { SizeTransition } from '../SizeTransition';

export default function React() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <p>
        React is a framework for building user interfaces and UI components. It
        is maintained by Facebook and actively developed by a large community
      </p>
      <button onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'less' : 'more'}...
      </button>
      <SizeTransition
        in={showMore}
        collapsedSize={{ height: 0, width: '100%' }}
      >
        <p>Main advantages</p>
        <ul>
          <li>Huge community and a ton of available libraries</li>
          <li>Very sophisticated and proven technology</li>
          <li>Wide spread usage</li>
        </ul>
      </SizeTransition>
    </>
  );
}

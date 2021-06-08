import React, { memo } from 'react';
// import shouldSkipUpdate from 'should-skip-update';

function Hello({ names }) {
  return [].map((name) => {
    return <div>{name}</div>;
  });
}
// memo(Hello, shouldSkipUpdate(['names']))


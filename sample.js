import React, { memo } from 'react';
import shouldSkipUpdate from 'should-skip-update';

function Hello({names}) {
  return names.map((name) => {
    return <div>{name}</div>;
  });
}
memo(Hello, shouldSkipUpdate(['names']))


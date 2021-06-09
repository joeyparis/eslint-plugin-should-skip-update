/* eslint-disable import/no-extraneous-dependencies, no-unused-vars */
import React, {memo} from 'react';
import shouldSkipUpdate from 'should-skip-update';

function Hello({names, people}) {
  return names.map((name) => <div key={name}>{name}</div>);
}
memo(Hello, shouldSkipUpdate([]));

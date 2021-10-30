import React from 'react';
import { App } from './App';
import { Connect } from '../../connect';
import { rootNodeContext } from './graph';

export class Root extends React.Component {
  render() {
    return (
      <div>
        <h1>To do:</h1>
        <div>
          <Connect component={App} node={rootNodeContext} />
        </div>
      </div>
    );
  }
}

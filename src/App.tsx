import React from 'react';

import { AddAction } from 'datagraph/dist/examples/refactor2/AddAction';
import { Dispatch } from 'datagraph/dist/examples/refactor2/Dispatch';

interface Props {
  value: number;
  queueDispatch: Dispatch;
}

export class App extends React.Component<Props> {
  add = () => {
    this.props.queueDispatch(AddAction.create());
  };

  render() {
    return (
      <div>
        <div>
          <button onClick={this.add}>Add</button>
        </div>
        <p>
          Hello, World { this.props.value }
        </p>
      </div>
    );
  }
}

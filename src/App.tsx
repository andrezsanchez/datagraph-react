import React from 'react';
import { AddAction } from './AddAction';

import { ChildProps } from './connect';
import { ResetAction } from './ResetAction';

type Props = ChildProps<
  number,
  & AddAction.KeyValue
  & ResetAction.KeyValue
>;

export class App extends React.Component<Props> {
  add = () => {
    this.props.queueDispatch(AddAction.create());
  };

  reset = () => {
    this.props.queueDispatch(ResetAction.create());
  };

  render() {
    return (
      <div>
        <div>
          <button onClick={this.add}>Add</button>
        </div>

        <div>
          <button onClick={this.reset}>Reset</button>
        </div>
        <p>
          Hello, World { this.props.value }
        </p>
      </div>
    );
  }
}

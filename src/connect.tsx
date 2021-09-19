import React from 'react';

import { Dispatch } from 'datagraph/dist/examples/refactor2/Dispatch';
import { RootDataGraph } from 'datagraph/dist/examples/refactor2/RootDataGraph';
import { ND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { UnknownProps } from 'datagraph/dist/examples/refactor2/Props';

export interface ConnectProps<V> {
  value: V;
}

export interface ChildProps<V> {
  value: V;
  queueDispatch: Dispatch;
}

export function connect<V>(
  Child: React.ComponentType<ChildProps<V>>,
  graph: RootDataGraph,
  nodeDescriptor: ND<UnknownProps, V, unknown>,
) {
  class Connect extends React.Component<{}, { value: V }> {
    constructor(props: {}) {
      super(props);

      this.state = {
        value: graph.resolve(nodeDescriptor),
      }
  
      graph.addSideEffects(nodeDescriptor, (value) => {
        setTimeout(() => {
          this.setState({ value });
        });
      });
    }
  
    render() {
      return (
        <Child
          queueDispatch={graph.queueDispatch.bind(graph)}
          value={this.state.value}
        />
      );
    }
  }

  return <Connect />;
}
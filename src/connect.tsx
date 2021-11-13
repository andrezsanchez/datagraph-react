import React from 'react';

import { NodeContext, RefMap } from 'datagraph';

export interface ConnectComponentProps<V, R extends RefMap<R>> {
  value: V;
  node: NodeContext<V, R>
}

export type ConnectProps<V, R extends RefMap<R>> = {
  component: React.ComponentType<ConnectComponentProps<V, R>>;
  node: NodeContext<V, R>;
}

export class Connect<V, R extends RefMap<R>> extends React.Component<ConnectProps<V, R>, { value: V }> {
  private nodeContext: NodeContext<V, R>;

  sideEffects = (value: V) => {
    this.setState({ value });
  }

  constructor(props: ConnectProps<V, R>) {
    super(props);

    this.state = {
      value: props.node.graph.resolve(props.node.nd),
    };

    props.node.graph.addSideEffects(props.node.nd, this.sideEffects);

    this.nodeContext = props.node;
  }

  componentWillUnmount() {
    this.props.node.graph.removeSideEffects(this.props.node.nd, this.sideEffects);
  }

  render() {
    const Component = this.props.component;
    return (
      <Component node={this.nodeContext} value={this.state.value}>
        {this.props.children}
      </Component>
    );
  }
}
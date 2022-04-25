import React from 'react';

import { NodeSelection, WUnknown } from '@datagraph/dgf';

export interface ConnectComponentProps<N extends WUnknown> {
  value: N["value"];
  node: NodeSelection<N>
}

export type ConnectProps<N extends WUnknown> = {
  component: React.ComponentType<ConnectComponentProps<N>>;
  node: NodeSelection<N>;
}

export class Connect<N extends WUnknown> extends React.Component<ConnectProps<N>, { value: N["value"] }> {
  private nodeContext: NodeSelection<N>;

  sideEffects = (value: N["value"]) => {
    this.setState({ value });
  }

  constructor(props: ConnectProps<N>) {
    super(props);

    const value = props.node.graph.resolve(props.node.nd);
    this.state = { value };

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
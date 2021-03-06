import React, { useEffect, useState } from 'react';
import { NodeSelection, WUnknown } from '@datagraph/dgf';

export function useNode<N extends WUnknown>(node: NodeSelection<N>) {
  const [state, setState] = useState(() => node.graph.resolve(node.nd));

  function sideEffects(value: N["value"]) {
    setState(value);
  }

  useEffect(() => {
    node.graph.addSideEffects(node.nd, sideEffects);

    return () => {
      node.graph.removeSideEffects(node.nd, sideEffects);
    };
  });

  return state;
}

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
  };

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
import React from 'react';

import { GND, ND, Dispatch, UnknownProps, RefMap, UnknownRefMap, UnknownActions, IDataGraph } from 'datagraph';

export interface ConnectComponentProps<V, R extends RefMap<R>> {
  value: V;
  node: NodeContext<V, R>
}

export type Select<RootV, RootR extends RefMap<RootR>> = <V, R extends RefMap<R>>(
  getND: (
    root: ND<UnknownProps, RootV, UnknownActions, RootR>,
    refs: <NodeV, NodeR extends RefMap<NodeR>>(nd: ND<UnknownProps, NodeV, UnknownActions, NodeR>) => RefMap<NodeR>,
  ) => ND<UnknownProps, V, UnknownActions, R>,
) => NodeContext<V, R>;

export type NodeContext<V, R extends RefMap<R>> = {
  queueDispatch: Dispatch;
  graph: IDataGraph;
  nd: ND<UnknownProps, V, UnknownActions, UnknownRefMap>;
  select: Select<V, R>;
};

export function createSelect<RootV, RootR extends RefMap<RootR>>(
  graph: IDataGraph,
  nd: ND<UnknownProps, RootV, UnknownActions, RootR>,
) {
  return <V, R extends RefMap<R>>(
    getND: (
      root: typeof nd,
      refs: <NodeV, NodeR extends RefMap<NodeR>>(nd: ND<UnknownProps, NodeV, UnknownActions, NodeR>) => RefMap<NodeR>,
    ) => ND<UnknownProps, V, UnknownActions, R>,
  ): NodeContext<V, R> => {
    const contextMap = new Map<GND, NodeContext<unknown, UnknownRefMap>>();

    contextMap.set(
      nd,
      {
        queueDispatch: graph.queueDispatch,
        graph,
        nd,
        select: createSelect(graph, nd),
      },
    );

    function refs<V2, T extends RefMap<T>>(nd: ND<UnknownProps, V2, UnknownActions, T>): RefMap<T> {
      const refMap = graph.getRefMap(nd);
      if (!refMap) throw new Error('Resolution error');

      const context = contextMap.get(nd);
      if (!context) throw new Error('Invalid node descriptor');

      // We don't yet have a way to reference the graphs on ContainerNode, so we cast to `any`
      // and hope that dg is what we assume it is.
      const childGraph = (context.graph.resolveInstance(nd) as any)?.dg;
      for (const childNd of Object.values(refMap)) {
        contextMap.set(
          childNd as GND,
          {
            queueDispatch: childGraph.queueDispatch,
            graph: childGraph,
            nd: childNd as GND,
            select: createSelect(childGraph, childNd as GND),
          },
        );
      }

      return refMap;
    }

    return contextMap.get(getND(nd, refs)) as NodeContext<V, R>;
  };
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
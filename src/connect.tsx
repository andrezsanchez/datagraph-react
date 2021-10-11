import React from 'react';

import { IDataGraph } from 'datagraph/dist/examples/refactor2/IDataGraph';
import { Actions, UnknownActions } from 'datagraph/dist/examples/refactor2/Actions';
import { UnknownRefMap } from 'datagraph/dist/examples/refactor2/RefMap';
import { ActionMap } from 'datagraph/dist/src/StateMachineNode';
import { RefMap } from 'datagraph/dist/examples/refactor2/RefMap';
import { UnknownProps } from 'datagraph/dist/examples/refactor2/Props';
import { GND, ND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { Dispatch } from 'datagraph/dist/examples/refactor2/Dispatch';

type MyDispatch<A> = (action: ActionMap<A>[keyof A]) => void;

export interface ConnectProps<V> {
  value: V;
}

export interface ChildProps<V, A> {
  value: V;
  queueDispatch: MyDispatch<A>;
}

export function connect<V, A extends Actions<A>, R extends RefMap<R>, RV>(
  Child: React.ComponentType<ChildProps<V, A>>,
  rootGraph: IDataGraph,
  rootND: ND<UnknownProps, RV, UnknownActions, R>,
  getND: (
    node: ND<UnknownProps, RV, UnknownActions, R>,
    refs: <V2, T extends RefMap<T>>(nd: ND<UnknownProps, V2, UnknownActions, T>) => RefMap<T>,
  ) => ND<UnknownProps, V, UnknownActions, UnknownRefMap>,
) {
  class Connect extends React.Component<{}, { value: V }> {
    private queueDispatch: Dispatch;

    constructor(props: {}) {
      super(props);

      const contextMap = new Map<GND, {
        queueDispatch: Dispatch,
        graph: IDataGraph,
      }>();

      contextMap.set(
        rootND,
        {
          queueDispatch: rootGraph.queueDispatch,
          graph: rootGraph,
        },
      );

      function refs<V2, T extends RefMap<T>>(nd: ND<UnknownProps, V2, UnknownActions, T>): RefMap<T> {
        const refMap = rootGraph.getRefMap(nd);
        if (!refMap) throw new Error('Resolution error');
        
        const context = contextMap.get(nd);
        if (!context) throw new Error('Invalid node descriptor');

        const graph = (context.graph.resolveInstance(nd as GND) as any)?.dg;
        for (const childNd of Object.values(refMap)) {
          contextMap.set(
            childNd as GND,
            {
              queueDispatch: graph.queueDispatch,
              graph,
            },
          );
        }

        return refMap;
      }

      const nd = getND(rootND, refs);

      const context = contextMap.get(nd);
      if (!context) throw new Error('Invalid node descriptor');

      this.state = {
        value: context.graph.resolve(nd),
      }
  
      context.graph.addSideEffects(nd, (value) => {
        setTimeout(() => {
          this.setState({ value });
        });
      });

      const instance = context.graph.resolveInstance(nd);
      if (!instance) throw new Error('Resolution error');

      this.queueDispatch = context.queueDispatch;
    }
  
    render() {
      return (
        <Child
          queueDispatch={this.queueDispatch}
          value={this.state.value}
        />
      );
    }
  }

  return <Connect />;
}
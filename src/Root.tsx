import React from 'react';
import { createND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { RootDataGraph } from 'datagraph/dist/examples/refactor2/RootDataGraph';
import { App } from './App';
import { connect } from './connect';
import { RootNode } from './RootNode';

const rootNode = createND(RootNode, {});

const graph = new RootDataGraph();
graph.mountNodes(new Set([rootNode]));

export class Root extends React.Component {
  render() {
    return connect(App, graph, rootNode, (root, refs) => {
      return refs(root).x3;
    });
  }
}

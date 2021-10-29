import React from 'react';
import ReactDOM from 'react-dom';
import { Root } from './Root';

import { RootNode } from './RootNode';
import { createND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { RootDataGraph } from 'datagraph/dist/examples/refactor2/RootDataGraph';

const rootNode = createND(RootNode, {});

const graph = new RootDataGraph();
graph.mountNodes(new Set([rootNode]));

const applicationRoot = document.createElement('div');
document.body.appendChild(applicationRoot);

if (!applicationRoot) {
  throw new Error('Could not find #application-root');
}

ReactDOM.render(
  React.createElement(Root, { graph, rootNode }),
  applicationRoot,
);

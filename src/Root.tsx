import React from 'react';
import { App } from './App';
import { connect } from './connect';

import { RefMap } from './RootNode';
import { RootDataGraph } from 'datagraph/dist/examples/refactor2/RootDataGraph';
import { ND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { UnknownProps } from 'datagraph/dist/examples/refactor2/Props';

interface Props {
  graph: RootDataGraph;
  rootNode: ND<UnknownProps, null, {}, RefMap>;
}

export class Root extends React.Component<Props> {
  render() {
    const app = connect(
      App,
      this.props.graph,
      this.props.rootNode,
      (root, refs) => refs(root).form,
    );

    return (
      <div>
        <h1>To do:</h1>
        <div>
          {app}
        </div>
      </div>
    );
  }
}

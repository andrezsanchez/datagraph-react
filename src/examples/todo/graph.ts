import { RefMap, RootNode } from './RootNode';
import { createND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { RootDataGraph } from 'datagraph/dist/examples/refactor2/RootDataGraph';
import { createSelect, NodeContext } from '../../connect';

export const graph = new RootDataGraph();

const root = createND(RootNode, {});
graph.mountNodes(new Set([root]));

export const rootNodeContext: NodeContext<null, RefMap> = {
  graph,
  nd: root,
  select: createSelect(graph, root),
  queueDispatch: graph.queueDispatch,
};

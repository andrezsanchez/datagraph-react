import {
  createND,
  GND,
  ND,
  NDFC,
  createContainerNode,
  NodeClass,
  RefMap as DataGraphRefMap,
  DescriptorProps,
  Props,
} from 'datagraph';
import { ScreenSettingsNode } from './ScreenSettingsNode';
import { ProjectionMatrixNode } from './ProjectionMatrixNode';
import { CameraPoseNode } from './CameraPoseNode';
import { PositionControllerNode } from './PositionControllerNode';

export type RefMap = {
  position: NDFC<typeof PositionControllerNode>;
  cameraPose: NDFC<typeof CameraPoseNode>;
  projectionMatrix: NDFC<typeof ProjectionMatrixNode>;
  screenSettings: NDFC<typeof ScreenSettingsNode>;
}

// export const RootNode = createContainerNode<{}, null, RefMap>(() => {
export const RootNode = createContainerNode(() => {
  const nodeSet = new Set<GND>();

  function node<P extends Props<P>, V, A, R extends DataGraphRefMap<R>>(
    Node: NodeClass<P, V, A, R>,
    props: DescriptorProps<P>,
  ): ND<P, V, A, R> {
    const nd = createND(Node, props);
    nodeSet.add(nd as GND);

    return nd;
  }

  const position = node(PositionControllerNode, {});
  const cameraPose = node(CameraPoseNode, {});
  const screenSettings = node(ScreenSettingsNode, {});
  const projectionMatrix = node(ProjectionMatrixNode, { cameraPose, screenSettings });

  return {
    nodeSet,
    outputNode: null,
    refs: {
      position,
      cameraPose,
      projectionMatrix,
      screenSettings,
    },
  };
});

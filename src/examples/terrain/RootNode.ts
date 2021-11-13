import { Matrix4 } from './Matrix4';
import { ProjectionMatrixNode } from './ProjectionMatrixNode';
import { CameraPose, CameraPoseNode } from './CameraPoseNode';
import {
  UnknownActions,
  UnknownProps,
  createND,
  GND,
  ND,
  createContainerNode,
} from 'datagraph';
import { PositionControllerNode, PositionControllerState } from './PositionControllerNode';
import { ScreenSettings, ScreenSettingsNode } from './ScreenSettingsNode';

export type RefMap = {
  position: ND<UnknownProps, PositionControllerState, UnknownActions, {}>;
  cameraPose: ND<UnknownProps, CameraPose, UnknownActions, {}>;
  projectionMatrix: ND<UnknownProps, Matrix4, UnknownActions, {}>;
  screenSettings: ND<UnknownProps, ScreenSettings, UnknownActions, {}>;
}

export const RootNode = createContainerNode<{}, null, RefMap>(() => {
  const position = createND(PositionControllerNode, {});
  const cameraPose = createND(CameraPoseNode, {});
  const screenSettings = createND(ScreenSettingsNode, {});
  const projectionMatrix = createND(ProjectionMatrixNode, { cameraPose, screenSettings });

  return {
    nodeSet: new Set<GND>([
      position,
      cameraPose,
      screenSettings,
      projectionMatrix,
    ]),
    outputNode: null,
    refs: {
      position,
      cameraPose,
      projectionMatrix,
      screenSettings,
    },
  };
});

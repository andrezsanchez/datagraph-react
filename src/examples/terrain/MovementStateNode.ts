import { createStateMachineNode } from 'datagraph';
import { MovementToggleAction } from './Actions';

export const MovementStateNode = createStateMachineNode<boolean, MovementToggleAction.KeyValue>({
  initialValue: true,
  actionHandlers: {
    ...MovementToggleAction.handler((state) => {
      return !state;
    }),
  },
});

import { createStateMachineNode } from 'datagraph';
import { ToggleAction } from './Actions';

export type CheckboxState = boolean;

export const CheckboxNode = createStateMachineNode<CheckboxState, {}>({
  initialValue: false,
  actionHandlers: {
    ...ToggleAction.handler((state) => !state),
  },
});

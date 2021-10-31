import { createStateMachineNode } from 'datagraph/dist/examples/refactor2/StateMachineNode';
import { ToggleAction } from './Actions';

export type CheckboxState = boolean;

export const CheckboxNode = createStateMachineNode<CheckboxState, {}>({
  initialValue: false,
  actionHandlers: {
    ...ToggleAction.handler((state) => !state),
  },
});
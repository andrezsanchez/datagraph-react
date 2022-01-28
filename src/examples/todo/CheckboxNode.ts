import { createStateMachineNode } from '@datagraph/dgf';
import { ToggleAction } from './Actions';

export type CheckboxState = boolean;

export const CheckboxNode = createStateMachineNode<CheckboxState, {}>({
  getInitialValue: () => false,
  actionHandlers: {
    ...ToggleAction.handler((state) => !state),
  },
});

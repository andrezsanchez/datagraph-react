import { createStateMachineNode } from '@datagraph/dgf';
import { ToggleAccordianAction } from './Actions';

export type CheckboxState = boolean;

export const AccordianNode = createStateMachineNode<CheckboxState, {}>({
  getInitialValue: () => true,
  actionHandlers: {
    ...ToggleAccordianAction.handler((state) => !state),
  },
});

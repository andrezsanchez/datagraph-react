import { createStateMachineNode } from 'datagraph/dist/examples/refactor2/StateMachineNode';
import { AddEntryAction, SetInputAction } from './Actions';

export type FormState = {
  list: string[];
  input: string;
}

export const FormNode = createStateMachineNode<FormState, {}>({
  initialValue: {
    list: ['what'],
    input: '1234',
  },
  actionHandlers: {
    ...AddEntryAction.handler((state) => {
      // If there's no input, do nothing.
      if (state.input.length === 0) {
        return state;
      }

      // Append the current input to the list and clear the input.
      return {
        list: [...state.list, state.input],
        input: '',
      };
    }),

    ...SetInputAction.handler((state, action) => {
      // Just assign the input and leave the list alone.
      return {
        list: state.list,
        input: action.payload,
      };
    }),
  }
});
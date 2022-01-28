import {
  UnknownActions,
  UnknownProps,
  createND,
  GND,
  ND,
  createContainerNode,
} from '@datagraph/dgf';
import { CheckboxNode, CheckboxState } from './CheckboxNode';
import { FormNode, FormState } from './FormNode';

export type RefMap = {
  form: ND<UnknownProps, FormState, UnknownActions, {}>;
  checkbox: ND<UnknownProps, CheckboxState, UnknownActions, {}>;
}

export const RootNode = createContainerNode<{}, null, RefMap>(() => {
  const form = createND(FormNode, { x: 5 });

  const checkbox = createND(CheckboxNode, {});

  return {
    nodeSet: new Set<GND>([form, checkbox]),
    outputNode: null,
    refs: { form, checkbox },
  };
});

import { CheckboxNode, CheckboxState } from './CheckboxNode';
import { UnknownActions } from 'datagraph/dist/examples/refactor2/Actions';
import { UnknownProps } from 'datagraph/dist/examples/refactor2/Props';
import { createND, GND, ND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { createContainerNode } from 'datagraph/dist/examples/refactor2/ContainerNode';
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

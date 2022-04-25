import {
  createND,
  GND,
  createContainerNode,
} from '@datagraph/dgf';
import { CheckboxNode } from './CheckboxNode';
import { FormNode } from './FormNode';

export const RootNode = createContainerNode(() => {
  const form = createND(FormNode, { x: 5 });
  const checkbox = createND(CheckboxNode, {});

  return {
    nodeSet: new Set<GND>([form, checkbox]),
    outputNode: null,
    refs: { form, checkbox },
  };
});

import {
  createND,
  GND,
  createContainerNode,
} from '@datagraph/dgf';
import { AccordianNode } from './AccordianNode';
import { FormNode } from './FormNode';

export const RootNode = createContainerNode(() => {
  const form = createND(FormNode, { x: 5 });
  const accordian = createND(AccordianNode, {});

  return {
    nodeSet: new Set<GND>([form, accordian]),
    outputNode: null,
    refs: { form, accordian },
  };
});

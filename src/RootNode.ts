import { RootNode as RNode } from 'datagraph/dist/examples/refactor2/RootNode';
import { createND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { createFunctionalNode } from 'datagraph/dist/examples/refactor2/FunctionalNode';
import { AddAction } from 'datagraph/dist/examples/refactor2/AddAction';
import { createContainerNode } from 'datagraph/dist/examples/refactor2/ContainerNode';

const X2 = createFunctionalNode(
  (props: { value: number }): number => props.value / 2,
);

interface X3Props {
  a: number;
  b: number;
}

const X3 = createFunctionalNode(
  (props: X3Props) => props.a + props.b,
  {
    valueChangeSideEffects: ({ queueDispatch, value }) => {
      if (value > 200 && value < 500000) {
        queueDispatch(AddAction.create());
      }
    },
  },
);

export const RootNode = createContainerNode(() => {
  const root = createND(RNode, { x: 5 });
  const x2 = createND(X2, { value: root });
  const x3 = createND(X3, { a: x2, b: root });

  return {
    nodeSet: new Set([root, x2, x3]),
    outputNode: x3,
  };
});

import {
  UnknownActions,
  UnknownProps,
  createND,
  createFunctionalNode,
  createContainerNode,
  GND,
  ND,
} from '@datagraph/dgf';
import { ExampleNode } from './ExampleNode';
import { AddAction } from './AddAction';

const X2 = createFunctionalNode(
  (props: { value: number }): number => props.value / 2,
);

type X3Props = {
  a: number;
  b: number;
}

const K = 10000;

const X3 = createFunctionalNode(
  (props: X3Props) => props.a + props.b,
  {
    valueChangeSideEffects: ({ queueDispatch, value }) => {
      if (value > 20 && value < K) {
        console.log('Queue AddAction');
        queueDispatch(AddAction.create());
      }

      if (value > K) {
        console.log('done');
      }
    },
  },
);

export type RefMapOld = {
  x3: ND<UnknownProps, number, UnknownActions, {}>;
}

export const RootNodeOld = createContainerNode<{}, number, RefMapOld>(() => {
  const root = createND(ExampleNode, { x: 5 });
  const x2 = createND(X2, { value: root });
  const x3 = createND(X3, { a: x2, b: root });

  return {
    nodeSet: new Set<GND>([root, x2, x3]),
    outputNode: x3,
    refs: { x3 },
  };
});

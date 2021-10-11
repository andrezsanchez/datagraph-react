import { ExampleNode } from './ExampleNode';
import { UnknownActions } from 'datagraph/dist/examples/refactor2/Actions';
import { UnknownProps } from 'datagraph/dist/examples/refactor2/Props';
import { createND, GND, ND } from 'datagraph/dist/examples/refactor2/NodeDescriptor';
import { createFunctionalNode } from 'datagraph/dist/examples/refactor2/FunctionalNode';
import { AddAction } from 'datagraph/dist/examples/refactor2/AddAction';
import { createContainerNode } from 'datagraph/dist/examples/refactor2/ContainerNode';

const X2 = createFunctionalNode(
  (props: { value: number }): number => props.value / 2,
);

type X3Props = {
  a: number;
  b: number;
}

const K = 50000;

const X3 = createFunctionalNode(
  (props: X3Props) => props.a + props.b,
  {
    valueChangeSideEffects: ({ queueDispatch, value }) => {
      if (value > 20 && value < K) {
        queueDispatch(AddAction.create());
      }

      if (value > K) {
        console.log('done');
      }
    },
  },
);

type ComponentARefMap = {
  x3: ND<UnknownProps, number, UnknownActions, {}>;
}

const ComponentA = createContainerNode<{ b: number}, number, ComponentARefMap>((props) => {
  const x3 = createND(X3, { a: 9, b: props.b });
  return {
    nodeSet: new Set<GND>([x3]),
    outputNode: x3,
    refs: { x3 },
  }
});

type RefMap = {
  x3: ND<UnknownProps, number, UnknownActions, {}>;
  componentA: ND<UnknownProps, number, UnknownActions, ComponentARefMap>;
}

export const RootNode = createContainerNode<{}, number, RefMap>(() => {
  const root = createND(ExampleNode, { x: 5 });
  const x2 = createND(X2, { value: root });
  const x3 = createND(X3, { a: x2, b: root });

  const componentA = createND(ComponentA, { b: root });

  const refs: RefMap = { x3, componentA };

  return {
    nodeSet: new Set<GND>([root, x2, x3, componentA]),
    outputNode: x3,
    refs,
  };
});

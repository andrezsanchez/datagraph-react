import React, { FormEventHandler, ChangeEvent } from 'react';
import { useNode } from '../../connect';

import { AddEntryAction, SetInputAction, ToggleAccordianAction as ToggleAccordianAction } from './Actions';
import { FormNode } from './FormNode';
import { NDFC, NodeSelection } from '@datagraph/dgf';
import { AccordianNode } from './AccordianNode';
import { graph } from './graph';

type FormProps = {
  node: NodeSelection<NDFC<typeof FormNode>>
}

function Form({ node }: FormProps) {
  const value = useNode(node);

  const list = value.list.map((value, index) => (
    <div key={`${index}__${value}`}>
      <input type="checkbox" checked={true} readOnly /> {value}
    </div>
  ));

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    node.queueDispatch(SetInputAction.create(event.target.value));
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    node.queueDispatch(AddEntryAction.create());
  }

  return (
    <div>
      <div>
        {list}
      </div>
      <div>
        <form onSubmit={onFormSubmit}>
          <input type="text" onChange={onInputChange} value={value.input} />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

type CheckboxProps = {
  node: NodeSelection<NDFC<typeof AccordianNode>>;
  children: React.ReactNode;
}

function Group({ node, children }: CheckboxProps) {
  const state = useNode(node);

  const onClick = () => {
    node.queueDispatch(ToggleAccordianAction.create());
  };

  return (
    <div>
      <h1 onClick={onClick}>Form</h1>
      <div>
        {state ? children : null}
      </div>
    </div>
  );
}

export class App extends React.Component {
  render() {
    return (
      <div>
        <Group node={graph.select((root) => root.accordian)}>
          <Form node={graph.select((root) => root.form)} />
        </Group>
      </div>
    );
  }
}

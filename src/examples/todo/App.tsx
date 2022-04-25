import React, { FormEventHandler, ChangeEvent } from 'react';
import { ConnectComponentProps, Connect } from '../../connect';

import { AddEntryAction, SetInputAction, ToggleAction } from './Actions';
import { FormNode } from './FormNode';
import { NDFC } from '@datagraph/dgf';
import { CheckboxNode } from './CheckboxNode';
import { graph } from './graph';

type FormProps = ConnectComponentProps<NDFC<typeof FormNode>>;

class Form extends React.Component<FormProps> {
  onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.node.queueDispatch(SetInputAction.create(event.target.value));
  };

  onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    this.props.node.queueDispatch(AddEntryAction.create());
  }

  render() {
    const list = this.props.value.list.map((value, index) => (
      <div key={`${index}__${value}`}>
        <input type="checkbox" checked={true} readOnly /> {value}
      </div>
    ));

    return (
      <div>
        <div>
          {list}
        </div>
        <div>
          <form onSubmit={this.onFormSubmit}>
            <input type="text" onChange={this.onInputChange} value={this.props.value.input} />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

type CheckboxProps = ConnectComponentProps<NDFC<typeof CheckboxNode>>;

class Checkbox extends React.Component<CheckboxProps> {
  onClick = () => {
    this.props.node.queueDispatch(ToggleAction.create());
  };
  render() {
    return (
      <div>
        <h1 onClick={this.onClick}>Form</h1>
        <div>
          {this.props.value ? this.props.children : null}
        </div>
      </div>
    );
  }
}

export class App extends React.Component {
  render() {
    return (
      <div>
        <Connect
          node={graph.select((root) => root.checkbox)}
          component={Checkbox}
        >
          <Connect
            node={graph.select((root) => root.form)}
            component={Form}
          />
        </Connect>
      </div>
    );
  }
}

import React, { FormEventHandler, ChangeEvent } from 'react';
import { ChildProps } from './connect';

import { AddEntryAction, SetInputAction } from './Actions';
import { FormState } from './RootNode';

type Props = ChildProps<
  FormState,
  & AddEntryAction.KeyValue
  & SetInputAction.KeyValue
>;

export class App extends React.Component<Props> {
  onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.queueDispatch(SetInputAction.create(event.target.value));
  };

  onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    this.props.queueDispatch(AddEntryAction.create());
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

import { ActionHandlerMap } from 'datagraph/dist/examples/refactor2/ActionHandlerMap';
import { DataNode } from 'datagraph/dist/examples/refactor2/DataNode';
import { NodeExportType, NodeExportValue } from 'datagraph/dist/examples/refactor2/NodeExport';
import { ActionKeys } from 'datagraph/dist/examples/refactor2/Actions';
import { AddAction } from './AddAction';
import { ResetAction } from './ResetAction';

type Actions = (
  & AddAction.KeyValue
  & ResetAction.KeyValue
);

type ActionExports = {};
type Props = {
  x: number,
};
type ValueType = number;
type RefMap = {};

export class ExampleNode implements DataNode<ValueType, Actions, Props, ActionExports, RefMap> {
  private exportedChildren = null;

  private state: number = 0;
  private version = 0;

  private value: number = NaN;

  initialize() {}

  private f(state: number, props: Props) {
    return state * 99 + 5 + props.x;
  }

  private setValue(value: number) {
    if (this.value !== value) {
      this.version += 1;
      this.value = value;
    }
  }
  private update(props: Props) {
    this.setValue(this.f(this.state, props));
  }

  getActionHandlers(): ActionHandlerMap<Actions, Props> {
    return {
      [AddAction.name]: (action: AddAction.Type, props: Props) => {
        this.state += 1;
        this.update(props);
      },
      [ResetAction.name]: (action: ResetAction.Type, props: Props) => {
        this.state = 0;
        this.update(props);
      },
    };
  }

  propsDidChange(props: Props) {
    this.update(props);
  }

  getValueVersion() {
    return this.version;
  }

  get(): NodeExportValue<ValueType> {
    return {
      type: NodeExportType.Value,
      value: this.value,
    };
  }

  nodeDidUnmount() {
    console.log('Root unmounted')
  }

  actionExports(): ActionKeys<ActionExports> {
    return {
    };
  }

  valueChangeSideEffects() {
  }

  updateChildren() {
  }

  getChildrenVersion() {
    return 0;
  }

  getChildren() {
    return this.exportedChildren;
  }

  getRefs() {
    return {};
  }
}
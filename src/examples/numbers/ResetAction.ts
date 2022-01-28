import { Action, makeActionCreator, makeFnActionHandlerCreator } from "@datagraph/dgf";

export namespace ResetAction {
  export const name = 'ResetAction';
  export type Payload = void;

  export type Name = typeof name;
  export type KeyValue = { [name]: Payload };
  export type Type = Action<typeof name, Payload>;
  export const create = makeActionCreator(name);
  export const handler = makeFnActionHandlerCreator<KeyValue>(name);
}

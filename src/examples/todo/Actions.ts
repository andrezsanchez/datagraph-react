import { Action, makeActionCreator, makeFnActionHandlerCreator } from "@datagraph/dgf";

export namespace AddEntryAction {
  export const name = 'AddEntryAction';
  export type Payload = void;

  export type Name = typeof name;
  export type KeyValue = { [name]: Payload };
  export type Type = Action<typeof name, Payload>;
  export const create = makeActionCreator<Name, Payload>(name);
  export const handler = makeFnActionHandlerCreator<KeyValue>(name);
}

export namespace SetInputAction {
  export const name = 'SetInputAction';
  export type Payload = string;

  export type Name = typeof name;
  export type KeyValue = { [name]: Payload };
  export type Type = Action<typeof name, Payload>;
  export const create = makeActionCreator<Name, Payload>(name);
  export const handler = makeFnActionHandlerCreator<KeyValue>(name);
}

export namespace ToggleAccordianAction {
  export const name = 'ToggleAccordianAction';
  export type Payload = void;

  export type Name = typeof name;
  export type KeyValue = { [name]: Payload };
  export type Type = Action<typeof name, Payload>;
  export const create = makeActionCreator<Name, Payload>(name);
  export const handler = makeFnActionHandlerCreator<KeyValue>(name);
}


import { RootNode } from './RootNode';
import { createND, createGraph } from '@datagraph/dgf';

export const graph = createGraph(() => createND(RootNode, {}));

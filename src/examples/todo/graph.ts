import { RootNode } from './RootNode';
import { createND, createGraph } from 'datagraph';

export const graph = createGraph(() => createND(RootNode, {}));

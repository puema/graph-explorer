import { Graph, Node } from '../d3/types';
import { createState } from '../d3/state';

export const store = createStore();

function createStore() {
  const state = createState();
  const listeners: ((graph: Graph) => void)[] = [];

  function update() {
    listeners.forEach((listener) => listener(state.flattenVisible()));
  }

  const actions = {
    toggleAll: state.toggleAll,
    toggleVisible(node: Node) {
      node.isCollapsed = !node.isCollapsed;
    },
  };

  const mappedActions = Object.keys(actions).reduce(
    (mappedActions, key) => ({
      ...mappedActions,
      [key]: (...args: any[]) => {
        (actions as any)[key](...args);
        update();
      },
    }),
    {} as any
  );

  return {
    actions: mappedActions,
    subscribe(listener: (graph: Graph) => void) {
      listeners.push(listener);
      listener(state.flattenVisible());
    },
    unsubscribe(listener: (graph: Graph) => void) {
      listeners.splice(
        listeners.findIndex((l) => l === listener),
        1
      );
    },
  };
}

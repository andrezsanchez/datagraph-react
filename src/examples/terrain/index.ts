import { RootNode } from './RootNode';
import { MoveAction, MovementToggleAction, UpdateScreenSettingsAction } from './Actions';
import { ScreenSettings } from './ScreenSettingsNode';
import { initDom } from './initDom';
import { createGraph, NDFC, NodeSelection, createND } from '@datagraph/dgf';
import { initGraphics } from './initGraphics';

type Graph = NodeSelection<NDFC<typeof RootNode>>;

function updateScreenSettings(
  domElements: ReturnType<typeof initDom>,
  g: Graph,
) {
  const rect = domElements.applicationRoot.getBoundingClientRect();
  const dpr = window.devicePixelRatio;

  const context = g.select((root) => root.screenSettings);
  context.queueDispatch(UpdateScreenSettingsAction.create({
    sizeCssPixels: [rect.width, rect.height],
    devicePixelRatio: dpr,
  }));
}

function init(win: Window) {
  const domElements = initDom(win.document);
  const graph = createGraph(() => createND(RootNode, {}));

  function screenSettingsDidUpdate(screenSettings: ScreenSettings) {
    domElements.canvasElement.width = screenSettings.sizeCssPixels[0] * screenSettings.devicePixelRatio;
    domElements.canvasElement.height = screenSettings.sizeCssPixels[1] * screenSettings.devicePixelRatio;
  }
  
  win.addEventListener('resize', () => {
    updateScreenSettings(domElements, graph);
  });

  initGraphics(domElements.gl, graph, screenSettingsDidUpdate);
  
  win.addEventListener('keydown', (event) => {
    const positionContext = graph.select((root) => root.position);
    switch (event.key) {
      case 'ArrowLeft': {
        positionContext.queueDispatch(MoveAction.create(-1));
        break;
      }
      case 'ArrowRight': {
        positionContext.queueDispatch(MoveAction.create(1));
        break;
      }
      case ' ': {
        positionContext.queueDispatch(MovementToggleAction.create());
        break;
      }
    }
  });
  
  updateScreenSettings(domElements, graph);
}

init(window);

import { RootNode } from './RootNode';
import { fragmentShaderSource } from './shader.frag.glsl';
import { vertexShaderSource } from './shader.vert.glsl';
import { cubeLines } from './cubeLines';
import { Object3D } from './object3d';
import { Mat4Uniform } from './Mat4Uniform';
import { createFragmentShader, createProgram, createVertexShader } from './shader';
import { MoveAction, MovementToggleAction, UpdateScreenSettingsAction } from './Actions';
import { ScreenSettings } from './ScreenSettingsNode';
import { initDom } from './initDom';
import { createGraph, NDFC, NodeSelection, createND } from '@datagraph/dgf';

function uploadMat4Uniform(gl: WebGL2RenderingContext, uniform: Mat4Uniform, shader: WebGLShader) {
  const location = gl.getUniformLocation(shader, uniform.name);
  gl.uniformMatrix4fv(location, false, new Float32Array(uniform.data.buffer));
}

type Graph = NodeSelection<NDFC<typeof RootNode>>;

function initGraphics(
  gl: WebGL2RenderingContext,
  graph: Graph,
  screenSettingsDidUpdate: (screenSettings: ScreenSettings) => void,
) {
  const fragmentShader = createFragmentShader(gl, fragmentShaderSource);
  const vertexShader = createVertexShader(gl, vertexShaderSource);

  const shaderProgram = createProgram(gl, vertexShader, fragmentShader);

  const model = new Object3D(gl);
  {
    model.buffer = gl.createBuffer();
    model.shaderProgam = shaderProgram;

    model.setup();
    model.model.setIdentity();
    model.arrayType = gl.LINES;

    const bufferData = new Float32Array(cubeLines);
    const bufferGlReference = model.buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferGlReference);
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

    model.data = bufferData;
  }

  const needsUpload = {
    view: true,
    projection: true,
    model: true,
    viewport: true,
  };

  gl.useProgram(shaderProgram);

  {
    const context = graph.select((root) => root.position);
    context.graph.addSideEffects(context.nd, () => needsUpload.model = true);
  }

  {
    const context = graph.select((root) => root.screenSettings);
    context.graph.addSideEffects(context.nd, (screenSettings) => {
      screenSettingsDidUpdate(screenSettings);
      needsUpload.viewport = true;
    });
  }

  {
    const context = graph.select((root) => root.cameraPose);
    context.graph.addSideEffects(context.nd, () => needsUpload.view = true);
  }

  {
    const context = graph.select((root) => root.projectionMatrix);
    context.graph.addSideEffects(context.nd, () => needsUpload.projection = true);
  }

  function shouldRender() {
    return (
      needsUpload.viewport ||
      needsUpload.model ||
      needsUpload.view ||
      needsUpload.projection
    );
  }

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (needsUpload.viewport) {
      const screenSettings = graph.select((root) => root.screenSettings).resolve();

      const width = screenSettings.sizeCssPixels[0] * screenSettings.devicePixelRatio
      const height = screenSettings.sizeCssPixels[1] * screenSettings.devicePixelRatio;
      gl.viewport(
        0,
        0,
        width,
        height,
      );

      needsUpload.viewport = false;
    }

    if (needsUpload.model) {
      const position = graph.select((root) => root.position).resolve().position;
      model.model.setPosition({ x: position[0], y: position[1], z: position[2] });
      uploadMat4Uniform(gl, { name: 'model', data: model.model }, shaderProgram);
      needsUpload.model = false;
    }

    if (needsUpload.view) {
      const cameraPose = graph.select((root) => root.cameraPose).resolve();
      uploadMat4Uniform(gl, { name: 'view', data: cameraPose.poseInverse }, shaderProgram);
      needsUpload.view = false;
    }

    if (needsUpload.projection) {
      const projectionMatrix = graph.select((root) => root.projectionMatrix).resolve();
      uploadMat4Uniform(gl, { name: 'projection', data: projectionMatrix }, shaderProgram);
      needsUpload.projection = false;
    }

    model.render();

    const err = gl.getError();
    if (err) {
      throw new Error(`WebGL Error ${err}`);
    }
  }

  let previousTime = performance.now();
  function animate(time: number) {
    const delta = (time - previousTime) * 0.001;
    previousTime = time;

    // Don't process more than a quarter second of input at a time.
    const cappedDelta = Math.min(delta, 0.25);

    if (shouldRender()) {
      render();
    }

    requestAnimationFrame(animate);

    const positionNode = graph.select((root) => root.position);

    const n = 1;
    for (let i = 0; i < n; i += 1) {
      positionNode.queueDispatch(MoveAction.create(cappedDelta / n));
    }
  }
  animate(0);
}

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
  const domElements = initDom();
  const graph = createGraph(() => createND(RootNode, {}));

  function screenSettingsDidUpdate(screenSettings: ScreenSettings) {
    domElements.canvasElement.width = screenSettings.sizeCssPixels[0] * screenSettings.devicePixelRatio;
    domElements.canvasElement.height = screenSettings.sizeCssPixels[1] * screenSettings.devicePixelRatio;
  }

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
  
  win.addEventListener('resize', () => {
    updateScreenSettings(domElements, graph);
  });
  
  updateScreenSettings(domElements, graph);
}

init(window);

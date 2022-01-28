import { RefMap, GetND } from '@datagraph/dgf';
import { fragmentShaderSource } from './shader.frag.glsl';
import { vertexShaderSource } from './shader.vert.glsl';
import { cubeLines } from './cubeLines';
import { Object3D } from './object3d';
import { RefMap as RootRefMap } from './RootNode';
import { Mat4Uniform } from './Mat4Uniform';
import { graph } from './graph';
import { createFragmentShader, createProgram, createVertexShader } from './shader';
import { MoveAction, MovementToggleAction, UpdateScreenSettingsAction } from './Actions';
import { ScreenSettings } from './ScreenSettingsNode';
import { initDom } from './initDom';

const domElements = initDom();

function resolve<V, R extends RefMap<R>>(fn: GetND<null, RootRefMap, V, R>) {
  const thing = graph.select(fn);
  return thing.graph.resolve(thing.nd);
}

function updateScreenSettings() {
  const rect = domElements.applicationRoot.getBoundingClientRect();
  const dpr = window.devicePixelRatio;

  const context = graph.select((root, refs) => refs(root).screenSettings);
  context.queueDispatch(UpdateScreenSettingsAction.create({
    sizeCssPixels: [rect.width, rect.height],
    devicePixelRatio: dpr,
  }));
}

function screenSettingsDidUpdate(screenSettings: ScreenSettings) {
  domElements.canvasElement.width = screenSettings.sizeCssPixels[0] * screenSettings.devicePixelRatio;
  domElements.canvasElement.height = screenSettings.sizeCssPixels[1] * screenSettings.devicePixelRatio;
}

function init(gl: WebGL2RenderingContext) {
  const rect = domElements.applicationRoot.getBoundingClientRect();
  domElements.canvasElement.width = rect.width * devicePixelRatio;
  domElements.canvasElement.height = rect.height * devicePixelRatio;
  gl.viewport(0, 0, rect.width * devicePixelRatio, rect.height * devicePixelRatio);

  const fragmentShader = createFragmentShader(gl, fragmentShaderSource);
  const vertexShader = createVertexShader(gl, vertexShaderSource);

  function uploadMat4Uniform(uniform: Mat4Uniform, shader: WebGLShader) {
    const location = gl.getUniformLocation(shader, uniform.name);
    gl.uniformMatrix4fv(location, false, new Float32Array(uniform.data.buffer));
  }

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

  gl.useProgram(shaderProgram);
  {
    const context = graph.select((root, refs) => refs(root).position);

    context.graph.addSideEffects(context.nd, (positionController) => {
      shouldRender = true;
      const position = positionController.position;
      model.model.setPosition({ x: position[0], y: position[1], z: position[2] });
      uploadMat4Uniform({ name: 'model', data: model.model }, shaderProgram);
    });
  }

  {
    const context = graph.select((root, refs) => refs(root).screenSettings);
    context.graph.addSideEffects(context.nd, (screenSettings) => {
      shouldRender = true;
      screenSettingsDidUpdate(screenSettings);
      const width = screenSettings.sizeCssPixels[0] * screenSettings.devicePixelRatio
      const height = screenSettings.sizeCssPixels[1] * screenSettings.devicePixelRatio;
      gl.viewport(
        0,
        0,
        width,
        height,
      );
    });
  }

  {
    const context = graph.select((root, refs) => refs(root).cameraPose);
    context.graph.addSideEffects(context.nd, (cameraPose) => {
      uploadMat4Uniform({ name: 'view', data: cameraPose.poseInverse }, shaderProgram);
    });

    const cameraPose = resolve((root, refs) => refs(root).cameraPose)
    uploadMat4Uniform({ name: 'view', data: cameraPose.poseInverse }, shaderProgram);
  }

  {
    const context = graph.select((root, refs) => refs(root).projectionMatrix);
    context.graph.addSideEffects(context.nd, (projectionMatrix) => {
      uploadMat4Uniform({ name: 'projection', data: projectionMatrix }, shaderProgram);
    });
  
    const projectionMatrix = resolve((root, refs) => refs(root).projectionMatrix)
    uploadMat4Uniform({ name: 'projection', data: projectionMatrix }, shaderProgram);
  }

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    model.render();

    const err = gl.getError();
    if (err) {
      throw new Error(`WebGL Error ${err}`);
    }
  }

  let shouldRender = true;
  let previousTime = performance.now();
  function animate(time: number) {
    const delta = (time - previousTime) * 0.001;
    previousTime = time;

    // Don't process more than a quarter second of input at a time.
    const cappedDelta = Math.min(delta, 0.25);
    // handleCameraInput(cappedDelta, inputManager, camera, viewUniform);

    if (shouldRender) {
      shouldRender = false;
      render();
    }

    requestAnimationFrame(animate);

    const positionNode = graph.select((root, refs) => refs(root).position);

    const n = 1;
    for (let i = 0; i < n; i += 1) {
      positionNode.queueDispatch(MoveAction.create(cappedDelta / n));
    }
  }
  animate(0);
}

init(domElements.gl);

window.addEventListener('keydown', (event) => {
  const positionContext = graph.select((root, refs) => refs(root).position);
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

window.addEventListener('resize', () => {
  updateScreenSettings();
});

updateScreenSettings();

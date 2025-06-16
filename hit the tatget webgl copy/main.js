import WebGLUtils from '../WebGLUtils.js'; // prilagodi putanju ako treba
import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';

let cameraPos = [0, 2, 5];
let cameraFront = [0, 0, -1];
let cameraUp = [0, 1, 0];
let keys = new Set();
const cameraSpeed = 0.1;

document.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

function updateCameraPosition() {
  const front = vec3.create();
  vec3.scale(front, cameraFront, cameraSpeed);
  const right = vec3.create();
  vec3.cross(right, cameraFront, cameraUp);
  vec3.normalize(right, right);
  vec3.scale(right, right, cameraSpeed);
  if (keys.has('w')) vec3.add(cameraPos, cameraPos, front);
  if (keys.has('s')) vec3.sub(cameraPos, cameraPos, front);
  if (keys.has('a')) vec3.sub(cameraPos, cameraPos, right);
  if (keys.has('d')) vec3.add(cameraPos, cameraPos, right);
}

function getRandomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

async function main() {
  const gl = WebGLUtils.initWebGL();
  WebGLUtils.resizeCanvasToWindow(gl);
  gl.enable(gl.DEPTH_TEST);

  const program = await WebGLUtils.createProgram(gl, "vertex-shader.glsl", "fragment-shader.glsl");
  gl.useProgram(program);

  const groundVertices = await WebGLUtils.loadOBJ("../shapes/ground.obj");
  const groundVAO = WebGLUtils.createVAO(gl, program, groundVertices, 8, [
    { name: "in_position", size: 3, offset: 0 },
  ]);

  // TARGET: kocka
  const cubeVertices = new Float32Array([
    -0.5,-0.5,-0.5,  0.5,-0.5,-0.5,  0.5, 0.5,-0.5, -0.5, 0.5,-0.5,
    -0.5,-0.5, 0.5,  0.5,-0.5, 0.5,  0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
  ]);
  const cubeIndices = new Uint16Array([
    0,1,2, 2,3,0, 4,5,6, 6,7,4,
    0,4,7, 7,3,0, 1,5,6, 6,2,1,
    3,2,6, 6,7,3, 0,1,5, 5,4,0,
  ]);

  const targetVAO = gl.createVertexArray();
  gl.bindVertexArray(targetVAO);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "in_position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIndices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);

  let targetPos = [getRandomPosition(-20, 20), 0, getRandomPosition(-20, 20)];
  let level = 2;
  let targetSpeed = 0.01 * level;

  function render() {
    updateCameraPosition();

    const projectionMat = mat4.create();
    const viewMat = mat4.create();
    const modelMatGround = mat4.create();
    const modelMatTarget = mat4.create();
    const mvpMatGround = mat4.create();
    const mvpMatTarget = mat4.create();

    mat4.perspective(projectionMat, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 1000);
    mat4.lookAt(viewMat, cameraPos, vec3.add([], cameraPos, cameraFront), cameraUp);

    // Pomeri metu
    targetPos[0] += targetSpeed;
    if (targetPos[0] > 50) targetPos[0] = -50;
    mat4.translate(modelMatTarget, modelMatTarget, targetPos);

    // MVP matrice
    mat4.multiply(mvpMatGround, projectionMat, viewMat);
    mat4.multiply(mvpMatGround, mvpMatGround, modelMatGround);
    mat4.multiply(mvpMatTarget, projectionMat, viewMat);
    mat4.multiply(mvpMatTarget, mvpMatTarget, modelMatTarget);

    gl.clearColor(0.2, 0.2, 0.3, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    const u_mvp = gl.getUniformLocation(program, "u_mvp");
    const u_color = gl.getUniformLocation(program, "u_color");

    // Target
    gl.bindVertexArray(targetVAO);
    gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
    gl.uniform3fv(u_color, [1, 0, 0]);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    // Ground
    gl.bindVertexArray(groundVAO);
    gl.uniformMatrix4fv(u_mvp, false, mvpMatGround);
    gl.uniform3fv(u_color, [0.1, 0.5, 0.1]);
    gl.drawArrays(gl.TRIANGLES, 0, groundVertices.length / 8);

    requestAnimationFrame(render);
  }

  render();
}

main();

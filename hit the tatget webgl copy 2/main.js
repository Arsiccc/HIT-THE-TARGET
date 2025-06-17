/* Example: 04-obj-format
 * Load and render a 3D model from an OBJ file.
 */

// NOTE: Shapes are located in the `shapes` directory.

import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';
import WebGLUtils from '../WebGLUtils.js';

let cameraFront = [0, 0, -1]; // Looking down-Z
let cameraUp = [0, 1, 0];

let yaw = -90;
let pitch = 0;
let grav = 0.1;
let lastgrav = 0;

// ARROW STUFFFF
let arrowVAO      = null;   // GPU handle
let arrowVertices = null;   // raw vertex buffer
let activeArrow   = null; 
document.addEventListener('mousemove', (e) => {
    const sensitivity = 0.1;
    let x = e.clientX;
    let y = e.clientY;
  
    if (firstMouse) {
      lastX = x;
      lastY = y;
      firstMouse = false;
    }
  
    let offsetX = x - lastX;
    let offsetY = lastY - y; // reversed Y
  
    lastX = x;
    lastY = y;
  
    offsetX *= sensitivity;
    offsetY *= sensitivity;
  
    // ✅ NO clamping for yaw (this allows infinite spin)
    yaw += offsetX;
  
    // ✅ Clamp pitch to avoid looking upside down
    pitch += offsetY;
    pitch = Math.max(-89, Math.min(89, pitch));
  
    // ✅ Recalculate direction vector
    const radYaw = yaw * Math.PI / 180;
    const radPitch = pitch * Math.PI / 180;
  
    cameraFront = [
      Math.cos(radYaw) * Math.cos(radPitch),
      Math.sin(radPitch),
      Math.sin(radYaw) * Math.cos(radPitch)
    ];
  
    vec3.normalize(cameraFront, cameraFront);
  });
  

let lastX = window.innerWidth / 2;
let lastY = window.innerHeight / 2;
let firstMouse = true;

let keys = new Set();
const cameraSpeed = 0.1;


document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase();
  keys.add(key);                     // keep WASD tracking   // <-- fire arrow
});
document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

// Global position and velocity
let cameraPos = vec3.fromValues(0, 2, 5);         // Example start pos
let frameVelocity = vec3.create();                // Set each frame by input system
let activeVelocity = vec3.create();               // Carries over and decays over time

function processVelocity() {
	const damping = 0.80; 

	// --- Add input velocity ---
	vec3.add(activeVelocity, activeVelocity, frameVelocity);
	vec3.add(cameraPos, cameraPos, activeVelocity);

	// --- Dampen velocity ---
	vec3.scale(activeVelocity, activeVelocity, damping);

	// --- Stop tiny velocities ---
	const threshold = 0.01;
	if (vec3.length(activeVelocity) < threshold) {
		vec3.set(activeVelocity, 0, 0, 0);
	}

	// --- Reset frame velocity ---
	vec3.set(frameVelocity, 0, 0, 0);

	// --- Gravity ---
	cameraPos[1] -= grav;
	cameraPos[1] -= lastgrav;

	if (cameraPos[1] < 2) {
		cameraPos[1] = 2;
		lastgrav = 0;
	} else {
		lastgrav += grav;
	}

	// --- Debug info ---
	//console.log('CameraPos:', cameraPos);
	//console.log('ActiveVelocity:', activeVelocity);
}

function updateCameraPosition() {
	const flatFront = vec3.clone(cameraFront);
	flatFront[1] = 0; // Remove vertical component
	vec3.normalize(flatFront, flatFront);

	const front = vec3.create();
	vec3.scale(front, flatFront, cameraSpeed); // Use flattened forward for movement

	const right = vec3.create();
	vec3.cross(right, cameraFront, cameraUp);
	vec3.normalize(right, right);
	vec3.scale(right, right, cameraSpeed);

	// Reset frame velocity
	vec3.set(frameVelocity, 0, 0, 0);

	// Movement input
	if (keys.has('w')) vec3.add(frameVelocity, frameVelocity, front);
	if (keys.has('s')) vec3.sub(frameVelocity, frameVelocity, front);
	if (keys.has('a')) vec3.sub(frameVelocity, frameVelocity, right);
	if (keys.has('d')) vec3.add(frameVelocity, frameVelocity, right);

	// Jumping only if near ground
	if (keys.has(' ') && cameraPos[1] <= 2.001) {
		frameVelocity[1] += 2;
	}
	
}

async function loadArrowModel(gl, program) {
  arrowVertices = await WebGLUtils.loadOBJ("../shapes/arrow.obj");
  arrowVAO = WebGLUtils.createVAO(gl, program, arrowVertices, 8, [
    { name: "in_position", size: 3, offset: 0 },
  ]);
}
	
/* ------------------------------------------------------------------ */
/*  2.  INPUT – SHOOT ARROW ON “x”                                     */
/* ------------------------------------------------------------------ */

async function shootArrow(gl, program) {
  if (
    activeArrow &&
    activeArrow.alive &&
    vec3.distance(cameraPos, activeArrow.pos) < 3.0
  ) return;

/*  if (!arrowVAO) {                   // lazily load the mesh once
    arrowVertices = await WebGLUtils.loadOBJ("../shapes/arrow.obj");
    arrowVAO = WebGLUtils.createVAO(gl, program, arrowVertices, 8, [
      { name: "in_position", size: 3, offset: 0 },
    ]);
  }*/

  const dir = vec3.clone(cameraFront);
  vec3.normalize(dir, dir);

  activeArrow = {
    pos: vec3.clone(cameraPos),
    vel: vec3.scale(vec3.create(), dir, 2.5),
    lastGrav: 0,
    alive: true,
  };
  //console.log(activeArrow)
}


/* ------------------------------------------------------------------ */
/*  3.  PER-FRAME UPDATE AND RENDER                                   */
/* ------------------------------------------------------------------ */
function updateArrow() {
  if (!activeArrow || !activeArrow.alive) return;

  /* physics */
  activeArrow.vel[1] -= grav + activeArrow.lastGrav;   // “accelerating” gravity
  activeArrow.lastGrav = grav;

  vec3.add(activeArrow.pos, activeArrow.pos, activeArrow.vel);

  /* kill on ground hit */
  if (activeArrow.pos[1] <= 0.1) {
    activeArrow.pos[1] = 0.1;
    activeArrow.alive  = false;
  }
}

function renderArrow(gl, program, viewMat, projectionMat) {
  if (!activeArrow || !activeArrow.alive) return;

  /* build model → MVP */
  const modelMat = mat4.create();
  mat4.translate(modelMat, modelMat, activeArrow.pos);

  /* (optional) point arrow in flight direction:
     const yaw   = Math.atan2(activeArrow.vel[0], activeArrow.vel[2]);
     const pitch = Math.atan2(activeArrow.vel[1],
                              Math.hypot(activeArrow.vel[0],activeArrow.vel[2]));
     mat4.rotateY(modelMat, modelMat, yaw);
     mat4.rotateX(modelMat, modelMat, -pitch);
  */

  const mvp = mat4.create();
  mat4.multiply(mvp, projectionMat, viewMat);
  mat4.multiply(mvp, mvp, modelMat);

  WebGLUtils.setUniformMatrix4fv(gl, program, ["u_mvp"], [mvp]);

  gl.bindVertexArray(arrowVAO);
  gl.drawArrays(gl.TRIANGLES, 0, arrowVertices.length / 8);
}

function callArow(gl, program){
   if (keys.has('x')) shootArrow(gl, program)
}


async function main() {
	const gl = WebGLUtils.initWebGL();
	gl.enable(gl.DEPTH_TEST);
	WebGLUtils.resizeCanvasToWindow(gl);

    const canvas = document.querySelector('canvas'); // or use getElementById if you have an id

    canvas.addEventListener('click', () => {
        canvas.requestPointerLock();
    });

  
	const vertices = await WebGLUtils.loadOBJ("../shapes/ground.obj");
	const program = await WebGLUtils.createProgram(gl, "vertex-shader.glsl", "fragment-shader.glsl");

	const VAO = WebGLUtils.createVAO(gl, program, vertices, 8, [
		{ name: "in_position", size: 3, offset: 0 },
	]);
  arrowVertices = await WebGLUtils.loadOBJ("../shapes/arrow.obj");
  arrowVAO = WebGLUtils.createVAO(gl, program, arrowVertices, 8, [
      { name: "in_position", size: 3, offset: 0 },
    ]);

	function render() {
		updateCameraPosition();
		processVelocity();
		updateArrow();
		callArow();
		const { modelMat, projectionMat } = WebGLUtils.createModelViewProjection(gl, cameraPos, vec3.add([], cameraPos, cameraFront));
		const viewMat = mat4.create();
		mat4.lookAt(viewMat, cameraPos, vec3.add([], cameraPos, cameraFront), cameraUp);

		const mvpMat = mat4.create();
		mat4.multiply(mvpMat, projectionMat, viewMat);
		mat4.multiply(mvpMat, mvpMat, modelMat);

		WebGLUtils.setUniformMatrix4fv(gl, program, ["u_mvp"], [mvpMat]);

		gl.clearColor(0.1, 0.1, 0.1, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram(program);
		gl.bindVertexArray(VAO);
		gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 8);
		renderArrow(gl, program, viewMat, projectionMat);
		requestAnimationFrame(render);
	}

	render();
}


main();
// import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';

// class WebGLUtils {
//   static initWebGL() {
//     const canvas = document.querySelector("canvas");
//     const gl = canvas.getContext("webgl2");
//     if (!gl) throw new Error("WebGL2 not supported");
//     return gl;
//   }

//   static createProgram(gl, vsSource, fsSource) {
//     const vs = WebGLUtils.compileShader(gl, gl.VERTEX_SHADER, vsSource);
//     const fs = WebGLUtils.compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
//     const program = gl.createProgram();
//     gl.attachShader(program, vs);
//     gl.attachShader(program, fs);
//     gl.linkProgram(program);
//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       throw new Error(gl.getProgramInfoLog(program));
//     }
//     return program;
//   }

//   static compileShader(gl, type, source) {
//     const shader = gl.createShader(type);
//     gl.shaderSource(shader, source);
//     gl.compileShader(shader);
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//       throw new Error(gl.getShaderInfoLog(shader));
//     }
//     return shader;
//   }

//   static createVAO(gl, program, data, stride, attributes) {
//     const vao = gl.createVertexArray();
//     gl.bindVertexArray(vao);
//     const buffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
//     for (let attr of attributes) {
//       const loc = gl.getAttribLocation(program, attr.name);
//       if (loc !== -1) {
//         gl.enableVertexAttribArray(loc);
//         gl.vertexAttribPointer(
//           loc,
//           attr.size,
//           gl.FLOAT,
//           false,
//           stride * Float32Array.BYTES_PER_ELEMENT,
//           attr.offset * Float32Array.BYTES_PER_ELEMENT
//         );
//       }
//     }
//     return vao;
//   }

//   static setUniformMatrix4fv(gl, program, names, matrices) {
//     for (let i = 0; i < names.length; i++) {
//       const loc = gl.getUniformLocation(program, names[i]);
//       if (loc) gl.uniformMatrix4fv(loc, false, matrices[i]);
//     }
//   }

//   static resizeCanvasToWindow(gl) {
//     const canvas = gl.canvas;
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     gl.viewport(0, 0, canvas.width, canvas.height);
//   }

//   static createModelViewProjection(gl, cameraPos, lookAtTarget) {
//     const projectionMat = mat4.create();
//     const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
//     mat4.perspective(projectionMat, Math.PI / 4, aspect, 0.1, 1000);
//     const viewMat = mat4.create();
//     mat4.lookAt(viewMat, cameraPos, lookAtTarget, [0, 1, 0]);
//     const modelMat = mat4.create();
//     return { modelMat, viewMat, projectionMat };
//   }

//   static async loadOBJ(url) {
//     const text = await fetch(url).then(r => r.text());
//     const lines = text.split("\n");
//     const positions = [], vertices = [];
//     for (let line of lines) {
//       const parts = line.trim().split(/\s+/);
//       if (parts[0] === 'v') {
//         positions.push(parts.slice(1).map(Number));
//       } else if (parts[0] === 'f') {
//         const indices = parts.slice(1).map(p => parseInt(p) - 1);
//         for (let i of indices) {
//           vertices.push(...positions[i], 0, 0, 0, 0, 0);
//         }
//       }
//     }
//     return vertices;
//   }
// }

// const vertexShaderSource = `#version 300 es
// precision mediump float;
// in vec3 in_position;
// uniform mat4 u_mvp;
// void main() {
//   gl_Position = u_mvp * vec4(in_position, 1.0);
// }`;

// const fragmentShaderSource = `#version 300 es
// precision mediump float;
// out vec4 fragColor;
// void main() {
//   fragColor = vec4(1.0, 0.8, 0.2, 1.0);
// }`;

// let cameraFront = [0, 0, -1];
// let cameraUp = [0, 1, 0];
// let cameraPos = vec3.fromValues(0, 2, 5);
// let yaw = -90, pitch = 0, grav = 0.1, lastgrav = 0;
// let lastX = window.innerWidth / 2, lastY = window.innerHeight / 2, firstMouse = true;
// let keys = new Set();
// let frameVelocity = vec3.create(), activeVelocity = vec3.create();
// let arrowVAO = null, arrowVertices = null, activeArrow = null;

// document.addEventListener('mousemove', e => {
//   const sensitivity = 0.1;
//   const x = e.clientX, y = e.clientY;
//   if (firstMouse) { lastX = x; lastY = y; firstMouse = false; }
//   let offsetX = x - lastX, offsetY = lastY - y;
//   lastX = x; lastY = y;
//   offsetX *= sensitivity; offsetY *= sensitivity;
//   yaw += offsetX;
//   pitch = Math.max(-89, Math.min(89, pitch + offsetY));
//   const radYaw = yaw * Math.PI / 180, radPitch = pitch * Math.PI / 180;
//   cameraFront = [
//     Math.cos(radYaw) * Math.cos(radPitch),
//     Math.sin(radPitch),
//     Math.sin(radYaw) * Math.cos(radPitch)
//   ];
//   vec3.normalize(cameraFront, cameraFront);
// });

// document.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
// document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

// function processVelocity() {
//   vec3.add(activeVelocity, activeVelocity, frameVelocity);
//   vec3.add(cameraPos, cameraPos, activeVelocity);
//   vec3.scale(activeVelocity, activeVelocity, 0.8);
//   if (vec3.length(activeVelocity) < 0.01) vec3.set(activeVelocity, 0, 0, 0);
//   vec3.set(frameVelocity, 0, 0, 0);
//   cameraPos[1] -= grav + lastgrav;
//   if (cameraPos[1] < 2) { cameraPos[1] = 2; lastgrav = 0; }
//   else lastgrav += grav;
// }

// function updateCameraPosition() {
//   const flatFront = vec3.clone(cameraFront); flatFront[1] = 0;
//   vec3.normalize(flatFront, flatFront);
//   const front = vec3.scale(vec3.create(), flatFront, 0.1);
//   const right = vec3.scale(
//     vec3.normalize(vec3.create(), vec3.cross(vec3.create(), cameraFront, cameraUp)),
//     0.1
//   );
//   if (keys.has('w')) vec3.add(frameVelocity, frameVelocity, front);
//   if (keys.has('s')) vec3.sub(frameVelocity, frameVelocity, front);
//   if (keys.has('a')) vec3.sub(frameVelocity, frameVelocity, right);
//   if (keys.has('d')) vec3.add(frameVelocity, frameVelocity, right);
//   if (keys.has(' ') && cameraPos[1] <= 2.001) frameVelocity[1] += 2;
// }

// function updateArrow() {
//   if (!activeArrow || !activeArrow.alive) return;
//   activeArrow.vel[1] -= grav + activeArrow.lastGrav;
//   activeArrow.lastGrav = grav;
//   vec3.add(activeArrow.pos, activeArrow.pos, activeArrow.vel);
//   if (activeArrow.pos[1] <= 0.1) {
//     activeArrow.pos[1] = 0.1;
//     activeArrow.alive = false;
//   }
// }

// function renderArrow(gl, program, viewMat, projectionMat) {
//   if (!activeArrow || !activeArrow.alive) return;
//   const modelMat = mat4.create();
//   mat4.translate(modelMat, modelMat, activeArrow.pos);
//   const mvp = mat4.create();
//   mat4.multiply(mvp, projectionMat, viewMat);
//   mat4.multiply(mvp, mvp, modelMat);
//   gl.useProgram(program);
//   WebGLUtils.setUniformMatrix4fv(gl, program, ["u_mvp"], [mvp]);
//   gl.bindVertexArray(arrowVAO);
//   gl.drawArrays(gl.TRIANGLES, 0, arrowVertices.length / 8);
// }

// async function shootArrow(gl) {
//   if (activeArrow && activeArrow.alive && vec3.distance(cameraPos, activeArrow.pos) < 3.0)
//     return;
//   const dir = vec3.normalize(vec3.create(), cameraFront);
//   activeArrow = {
//     pos: vec3.clone(cameraPos),
//     vel: vec3.scale(vec3.create(), dir, 2.5),
//     lastGrav: 0,
//     alive: true
//   };
// }

// async function main() {
//   const gl = WebGLUtils.initWebGL();
//   WebGLUtils.resizeCanvasToWindow(gl);
//   gl.enable(gl.DEPTH_TEST);
//   const program = WebGLUtils.createProgram(gl, vertexShaderSource, fragmentShaderSource);
//   const ground = await WebGLUtils.loadOBJ("../shapes/ground.obj");
//   const arrow = await WebGLUtils.loadOBJ("../shapes/arrow.obj");

//   const VAO = WebGLUtils.createVAO(gl, program, ground, 8, [
//     { name: "in_position", size: 3, offset: 0 }
//   ]);
//   arrowVertices = arrow;
//   arrowVAO = WebGLUtils.createVAO(gl, program, arrowVertices, 8, [
//     { name: "in_position", size: 3, offset: 0 }
//   ]);

//   document.addEventListener('keydown', e => {
//     if (e.key.toLowerCase() === 'x') shootArrow(gl);
//   });

//   document.querySelector('canvas').addEventListener('click', () => {
//     document.querySelector('canvas').requestPointerLock();
//   });

//   function render() {
//     updateCameraPosition();
//     processVelocity();
//     updateArrow();

//     const { modelMat, viewMat, projectionMat } =
//       WebGLUtils.createModelViewProjection(gl, cameraPos, vec3.add([], cameraPos, cameraFront));

//     const mvpMat = mat4.create();
//     mat4.multiply(mvpMat, projectionMat, viewMat);
//     mat4.multiply(mvpMat, mvpMat, modelMat);

//     gl.clearColor(0.1, 0.1, 0.1, 1.0);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//     gl.useProgram(program);
//     WebGLUtils.setUniformMatrix4fv(gl, program, ["u_mvp"], [mvpMat]);

//     gl.bindVertexArray(VAO);
//     gl.drawArrays(gl.TRIANGLES, 0, ground.length / 8);

//     renderArrow(gl, program, viewMat, projectionMat);
//     requestAnimationFrame(render);
//   }

//   render();
// }

// main();
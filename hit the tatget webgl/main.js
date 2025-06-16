/* Example: 04-obj-format
 * Load and render a 3D model from an OBJ file.
 */

// NOTE: Shapes are located in the `shapes` directory.

import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';
import WebGLUtils from '../WebGLUtils.js';

let cameraPos = [0, 2, 5]; // Start slightly above the ground
let cameraFront = [0, 0, -1]; // Looking down-Z
let cameraUp = [0, 1, 0];

let yaw = -90;
let pitch = 0;



function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  const targetPos = [
    getRandomPosition(-50, 50), // X
    0,                          // Y - na tlu
    getRandomPosition(-50, 50)  // Z
  ];
  

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
	let offsetY = lastY - y; // reversed
	lastX = x;
	lastY = y;

	offsetX *= sensitivity;
	offsetY *= sensitivity;

	yaw += offsetX;
	pitch += offsetY;

	pitch = Math.max(-89, Math.min(89, pitch));

	const radYaw = yaw * Math.PI / 180;
	const radPitch = pitch * Math.PI / 180;

	cameraFront = [
		Math.cos(radYaw) * Math.cos(radPitch),
		Math.sin(radPitch),
		Math.sin(radYaw) * Math.cos(radPitch)
	];

	vec3.normalize(cameraFront, cameraFront);
});


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

	function render() {
		updateCameraPosition();

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

		requestAnimationFrame(render);
	}

	render();
}


main();
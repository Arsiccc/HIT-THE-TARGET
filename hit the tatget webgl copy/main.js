// // import WebGLUtils from '../WebGLUtils.js'; // prilagodi putanju ako treba
// // import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';

// // let cameraPos = [0, 2, 5];
// // let cameraFront = [0, 0, -1];
// // let cameraUp = [0, 1, 0];
// // let keys = new Set();
// // const cameraSpeed = 0.1;

// // document.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
// // document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

// // function updateCameraPosition() {
// //   const front = vec3.create();
// //   vec3.scale(front, cameraFront, cameraSpeed);
// //   const right = vec3.create();
// //   vec3.cross(right, cameraFront, cameraUp);
// //   vec3.normalize(right, right);
// //   vec3.scale(right, right, cameraSpeed);
// //   if (keys.has('w')) vec3.add(cameraPos, cameraPos, front);
// //   if (keys.has('s')) vec3.sub(cameraPos, cameraPos, front);
// //   if (keys.has('a')) vec3.sub(cameraPos, cameraPos, right);
// //   if (keys.has('d')) vec3.add(cameraPos, cameraPos, right);
// // }

// // function getRandomPosition(min, max) {
// //   return Math.random() * (max - min) + min;
// // }

// // async function main() {
// //   const gl = WebGLUtils.initWebGL();
// //   WebGLUtils.resizeCanvasToWindow(gl);
// //   gl.enable(gl.DEPTH_TEST);

// //   const program = await WebGLUtils.createProgram(gl, "vertex-shader.glsl", "fragment-shader.glsl");
// //   gl.useProgram(program);

// //   const groundVertices = await WebGLUtils.loadOBJ("../shapes/ground.obj");
// //   const groundVAO = WebGLUtils.createVAO(gl, program, groundVertices, 8, [
// //     { name: "in_position", size: 3, offset: 0 },
// //   ]);

// //   // TARGET: kocka
// //   const cubeVertices = await WebGLUtils.loadOBJ("../shapes/torus.obj");
// // //   const cubeIndices = new Uint16Array([
// // //     0,1,2, 2,3,0, 4,5,6, 6,7,4,
// // //     0,4,7, 7,3,0, 1,5,6, 6,2,1,
// // //     3,2,6, 6,7,3, 0,1,5, 5,4,0,
// // //   ]);

// //   const targetVAO = gl.createVertexArray();
// //   gl.bindVertexArray(targetVAO);

// //   const positionBuffer = gl.createBuffer();
// //   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// //   gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

// //   const positionLocation = gl.getAttribLocation(program, "in_position");
// //   gl.enableVertexAttribArray(positionLocation);
// //   gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// // //   const indexBuffer = gl.createBuffer();
// // //   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
// // //   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeIndices, gl.STATIC_DRAW);
// // gl.bindVertexArray(targetVAO);
// // gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
// // gl.uniform3fv(u_color, [1, 0, 0]);
// // gl.drawArrays(gl.TRIANGLES, 0, targetVertices.length / 8);

// //   gl.bindVertexArray(null);

// //   let targetPos = [getRandomPosition(-20, 20), 0, getRandomPosition(-20, 20)];
// //   let targetMovement = 0;
// //   let targetSpeed = 0.01 * targetMovement;

// //   function render() {
// //     updateCameraPosition();

// //     const projectionMat = mat4.create();
// //     const viewMat = mat4.create();
// //     const modelMatGround = mat4.create();
// //     const modelMatTarget = mat4.create();
// //     const mvpMatGround = mat4.create();
// //     const mvpMatTarget = mat4.create();

// //     mat4.perspective(projectionMat, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 1000);
// //     mat4.lookAt(viewMat, cameraPos, vec3.add([], cameraPos, cameraFront), cameraUp);

// //     // Pomeri metu
// //     targetPos[0] += targetSpeed;
// //     if (targetPos[0] > 20 || targetPos[0]<-20) targetSpeed = -targetSpeed;
// //     mat4.translate(modelMatTarget, modelMatTarget, targetPos);

// //     // MVP matrice
// //     mat4.multiply(mvpMatGround, projectionMat, viewMat);
// //     mat4.multiply(mvpMatGround, mvpMatGround, modelMatGround);
// //     mat4.multiply(mvpMatTarget, projectionMat, viewMat);
// //     mat4.multiply(mvpMatTarget, mvpMatTarget, modelMatTarget);

// //     gl.clearColor(0.2, 0.2, 0.3, 1);
// //     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// //     gl.useProgram(program);

// //     const u_mvp = gl.getUniformLocation(program, "u_mvp");
// //     const u_color = gl.getUniformLocation(program, "u_color");

// //     // Target
// //     // gl.bindVertexArray(targetVAO);
// //     // gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
// //     // gl.uniform3fv(u_color, [1, 0, 0]);
// //     // gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);
// // 	// Prikaz mete
// // gl.bindVertexArray(targetVAO);
// // gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
// // gl.uniform3fv(u_color, [1, 0, 0]);
// // gl.drawArrays(gl.TRIANGLES, 0, targetVertices.length / 8); // 8 floats per vertex: position + ostalo


// //     // Ground
// //     gl.bindVertexArray(groundVAO);
// //     gl.uniformMatrix4fv(u_mvp, false, mvpMatGround);
// //     gl.uniform3fv(u_color, [0.1, 0.5, 0.1]);
// //     gl.drawArrays(gl.TRIANGLES, 0, groundVertices.length / 8);

// //     requestAnimationFrame(render);
// //   }

// //   render();
// // }

// // main();
// import WebGLUtils from '../WebGLUtils.js'; // prilagodi ako treba
// import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';

// let cameraPos = [0, 2, 5];
// let cameraFront = [0, 0, -1];
// let cameraUp = [0, 1, 0];
// let keys = new Set();
// const cameraSpeed = 0.1;

// document.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
// document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

// function updateCameraPosition() {
//   const front = vec3.create();
//   vec3.scale(front, cameraFront, cameraSpeed);
//   const right = vec3.create();
//   vec3.cross(right, cameraFront, cameraUp);
//   vec3.normalize(right, right);
//   vec3.scale(right, right, cameraSpeed);
//   if (keys.has('w')) vec3.add(cameraPos, cameraPos, front);
//   if (keys.has('s')) vec3.sub(cameraPos, cameraPos, front);
//   if (keys.has('a')) vec3.sub(cameraPos, cameraPos, right);
//   if (keys.has('d')) vec3.add(cameraPos, cameraPos, right);
// }

// function getRandomPosition(min, max) {
//   return Math.random() * (max - min) + min;
// }


// async function main() {
//   const gl = WebGLUtils.initWebGL();
//   WebGLUtils.resizeCanvasToWindow(gl);
//   gl.enable(gl.DEPTH_TEST);

//   const program = await WebGLUtils.createProgram(gl, "vertex-shader.glsl", "fragment-shader.glsl");
//   gl.useProgram(program);

//   const groundVertices = await WebGLUtils.loadOBJ("../shapes/ground.obj");
//   const groundVAO = WebGLUtils.createVAO(gl, program, groundVertices, 8, [
//     { name: "in_position", size: 3, offset: 0 },
//   ]);

//   // Učitaj torus - pretpostavka da cubeVertices ima po verteksu 8 floatova
//   const cubeVertices = await WebGLUtils.loadOBJ("../shapes/target.obj");

//   const targetVAO = gl.createVertexArray();
//   gl.bindVertexArray(targetVAO);

//   const FLOAT_SIZE = 4;
//   const stride = 8 * FLOAT_SIZE; // 8 floatova po verteksu

//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

//   const positionLocation = gl.getAttribLocation(program, "in_position");
//   gl.enableVertexAttribArray(positionLocation);
//   gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);

//   gl.bindVertexArray(null);

//   let targetPos = [getRandomPosition(-20, 20), 0, getRandomPosition(-20, 20)];
//   let targetMovement = 0;
//   let targetSpeed = 1 * targetMovement;

//   function render() {
//     updateCameraPosition();

//     const projectionMat = mat4.create();
//     const viewMat = mat4.create();
//     const modelMatGround = mat4.create();
//     const modelMatTarget = mat4.create();
//     const mvpMatGround = mat4.create();
//     const mvpMatTarget = mat4.create();

//     mat4.perspective(projectionMat, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 1000);
//     mat4.lookAt(viewMat, cameraPos, vec3.add([], cameraPos, cameraFront), cameraUp);
// mat4.identity(modelMatTarget);

// // Prvo skaliranje (npr. 0.2 puta manji u sve tri ose)
// mat4.scale(modelMatTarget, modelMatTarget, [0.02, 0.02, 0.02]);

//     // Pomeri metu
//     targetPos[0] += targetSpeed;
//     if (targetPos[0] > 150 || targetPos[0] < -150) targetSpeed = -targetSpeed;
//     mat4.translate(modelMatTarget, modelMatTarget, targetPos);

//     // MVP matrice
//     mat4.multiply(mvpMatGround, projectionMat, viewMat);
//     mat4.multiply(mvpMatGround, mvpMatGround, modelMatGround);
//     mat4.multiply(mvpMatTarget, projectionMat, viewMat);
//     mat4.multiply(mvpMatTarget, mvpMatTarget, modelMatTarget);

//     gl.clearColor(0.2, 0.2, 0.3, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     gl.useProgram(program);

//     const u_mvp = gl.getUniformLocation(program, "u_mvp");
//     const u_color = gl.getUniformLocation(program, "u_color");

//     // Prikaz mete (torusa)
//     gl.bindVertexArray(targetVAO);
//     gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
//     gl.uniform3fv(u_color, [1, 0, 0]);
//     const vertexCount = cubeVertices.length / 8; // 8 floatova po verteksu
//     gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
//     gl.bindVertexArray(null);

//     // Prikaz tla
//     gl.bindVertexArray(groundVAO);
//     gl.uniformMatrix4fv(u_mvp, false, mvpMatGround);
//     gl.uniform3fv(u_color, [0.1, 0.5, 0.1]);
//     gl.drawArrays(gl.TRIANGLES, 0, groundVertices.length / 8);
//     gl.bindVertexArray(null);

//     requestAnimationFrame(render);
//   }

//   render();
// }

//main();
// import WebGLUtils from '../WebGLUtils.js'; // prilagodi ako treba
// import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';

// let cameraPos = [0, 2, 5];
// let cameraFront = [0, 0, -1];
// let cameraUp = [0, 1, 0];
// let keys = new Set();
// const cameraSpeed = 0.1;

// document.addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
// document.addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

// function updateCameraPosition() {
//   const front = vec3.create();
//   vec3.scale(front, cameraFront, cameraSpeed);
//   const right = vec3.create();
//   vec3.cross(right, cameraFront, cameraUp);
//   vec3.normalize(right, right);
//   vec3.scale(right, right, cameraSpeed);
//   if (keys.has('w')) vec3.add(cameraPos, cameraPos, front);
//   if (keys.has('s')) vec3.sub(cameraPos, cameraPos, front);
//   if (keys.has('a')) vec3.sub(cameraPos, cameraPos, right);
//   if (keys.has('d')) vec3.add(cameraPos, cameraPos, right);
// }

// function getRandomPosition(min, max) {
//   return Math.random() * (max - min) + min;
  
// }
// // Ovo sprečava pokretanje dok ne klikne Play
// let gameStarted = false;

// document.getElementById('play-button').addEventListener('click', () => {
//   document.getElementById('ui-overlay').style.display = 'none';
//   gameStarted = true;
  



// async function main() {
//   const gl = WebGLUtils.initWebGL();
//   WebGLUtils.resizeCanvasToWindow(gl);
//   gl.enable(gl.DEPTH_TEST);
//   gl.disable(gl.CULL_FACE); // važno za prikaz bez rupa

//   const program = await WebGLUtils.createProgram(gl, "vertex-shader.glsl", "fragment-shader.glsl");
//   gl.useProgram(program);

//   const groundVertices = await WebGLUtils.loadOBJ("../shapes/ground.obj");
//   const groundVAO = WebGLUtils.createVAO(gl, program, groundVertices, 8, [
//     { name: "in_position", size: 3, offset: 0 },
//   ]);

//   const cubeVertices = await loadOBJ_noIndices("../shapes/target.obj");

//   const targetVAO = gl.createVertexArray();
//   gl.bindVertexArray(targetVAO);

//   const FLOAT_SIZE = 4;
//   const stride = 8 * FLOAT_SIZE;

//   const positionBuffer = gl.createBuffer();
//   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//   gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

//   const positionLocation = gl.getAttribLocation(program, "in_position");
//   gl.enableVertexAttribArray(positionLocation);
//   gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);

//   gl.bindVertexArray(null);

//   let targetPos = [getRandomPosition(-20, 20), 0, getRandomPosition(-20, 20)];
//   let targetMovement = 0;
//   let targetSpeed = 1 * targetMovement;

//   function render() {
//     updateCameraPosition();

//     const projectionMat = mat4.create();
//     const viewMat = mat4.create();
//     const modelMatGround = mat4.create();
//     const modelMatTarget = mat4.create();
//     const mvpMatGround = mat4.create();
//     const mvpMatTarget = mat4.create();

//     mat4.perspective(projectionMat, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 1000);
//     mat4.lookAt(viewMat, cameraPos, vec3.add([], cameraPos, cameraFront), cameraUp);

//     mat4.identity(modelMatTarget);
//     mat4.scale(modelMatTarget, modelMatTarget, [0.02, 0.02, 0.02]); // smanji metu

//     targetPos[0] += targetSpeed;
//     if (targetPos[0] > 150 || targetPos[0] < -150) targetSpeed = -targetSpeed;
//     mat4.translate(modelMatTarget, modelMatTarget, targetPos);

//     mat4.multiply(mvpMatGround, projectionMat, viewMat);
//     mat4.multiply(mvpMatGround, mvpMatGround, modelMatGround);
//     mat4.multiply(mvpMatTarget, projectionMat, viewMat);
//     mat4.multiply(mvpMatTarget, mvpMatTarget, modelMatTarget);

//     gl.clearColor(0.2, 0.2, 0.3, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

//     gl.useProgram(program);

//     const u_mvp = gl.getUniformLocation(program, "u_mvp");
//     const u_color = gl.getUniformLocation(program, "u_color");

//     // Prikaz mete
//     gl.bindVertexArray(targetVAO);
//     gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
//     gl.uniform3fv(u_color, [1, 0, 0]);
//     const vertexCount = cubeVertices.length / 8;
//     gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
//     gl.bindVertexArray(null);

//     // Prikaz tla
//     gl.bindVertexArray(groundVAO);
//     gl.uniformMatrix4fv(u_mvp, false, mvpMatGround);
//     gl.uniform3fv(u_color, [0.1, 0.5, 0.1]);
//     gl.drawArrays(gl.TRIANGLES, 0, groundVertices.length / 8);
//     gl.bindVertexArray(null);

//     requestAnimationFrame(render);
//   }

//   render();
// }

// main();
// });

// async function loadOBJ_noIndices(url) {
//   const text = await fetch(url).then(res => res.text());
//   const positions = [];
//   const finalVertices = [];

//   const lines = text.split('\n');
//   for (let line of lines) {
//     line = line.trim();
//     if (line.startsWith('v ')) {
//       const [, x, y, z] = line.split(/\s+/);
//       positions.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
//     } else if (line.startsWith('f ')) {
//       const verts = line.slice(2).trim().split(/\s+/);
//       if (verts.length === 3) {
//         for (const v of verts) {
//           const posIndex = parseInt(v.split('/')[0]) - 1;
//           finalVertices.push(...positions[posIndex], 0, 0, 0, 0, 0);
//         }
//       } else if (verts.length === 4) {
//         for (let i of [0, 1, 2]) {
//           const posIndex = parseInt(verts[i].split('/')[0]) - 1;
//           finalVertices.push(...positions[posIndex], 0, 0, 0, 0, 0);
//         }
//         for (let i of [0, 2, 3]) {
//           const posIndex = parseInt(verts[i].split('/')[0]) - 1;
//           finalVertices.push(...positions[posIndex], 0, 0, 0, 0, 0);
//         }
//       }
//     }
//   }

//   return new Float32Array(finalVertices);
import WebGLUtils from '../WebGLUtils.js';
import { mat4, vec3, vec2 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';

// Game state
let gameState = {
    cameraPos: [0, 2, 5], // Povišena kamera da ne propada u zemlju
    cameraFront: [0, 0, -1],
    cameraUp: [0, 1, 0],
    yaw: -90,
    pitch: 0,
    lastX: 0,
    lastY: 0,
    firstMouse: true,
    velocity: [0, 0, 0],
    gravity: -15, // Povećana gravitacija za realniji osećaj
    isJumping: false,
    onGround: true,
	showHitMessage: false,
    jumpForce: 8, // Povećana snaga skoka
    movementSpeed: 150, // Povećana brzina kretanja
    arrows: [],
    arrowSpeed: 10, // Povećana brzina strela
    canShoot: true,
    shootCooldown: 0.3,
    shootTimer: 0,
    chargeTime: 0, // Vreme držanja za jačinu pucnja
    maxChargeTime: 3, // Maksimalno vreme punjenja
    targetPos: [15, 0, 15], // Meta postavljena dalje
    targetMovement: 0,
    targetSpeed: 0,
    groundSize: 100,
    targetSize: 1.5, // Povećana veličina mete
    playerSize: [0.5, 1.8, 0.5], // Realnije dimenzije igrača
    gameStarted: false,
    lastTime: 0,
	
    hitMessageTime: 0,

};

// Input handling
let keys = new Set();

document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    keys.add(key);
    if (key === ' ' && gameState.onGround) {
        gameState.velocity[1] = gameState.jumpForce;
        gameState.onGround = false;
        gameState.isJumping = true;
    }
    
    // Pucanje na X
    if (key === 'x' && gameState.canShoot) {
        gameState.chargeTime = 0; // Resetujemo vreme punjenja
    }
});

document.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    keys.delete(key);
    
    // Kada pustimo X, pucamo sa odgovarajućom jačinom
    if (key === 'x' && gameState.canShoot && gameState.chargeTime > 0) {
        shootArrow();
        gameState.canShoot = false;
        gameState.shootTimer = gameState.shootCooldown;
    }
});

document.addEventListener('mousedown', e => {
    if (e.button === 0 && gameState.canShoot) {
        gameState.chargeTime = 0; // Resetujemo vreme punjenja
    }
});

document.addEventListener('mouseup', e => {
    if (e.button === 0 && gameState.canShoot && gameState.chargeTime > 0) {
        shootArrow();
        gameState.canShoot = false;
        gameState.shootTimer = gameState.shootCooldown;
    }
});

document.addEventListener('mousemove', e => {
    if (!gameState.gameStarted) return;
    
    if (gameState.firstMouse) {
        gameState.lastX = e.clientX;
        gameState.lastY = e.clientY;
        gameState.firstMouse = false;
    }

    const sensitivity = 0.2; // Povećana osetljivost miša
    const xoffset = (e.clientX - gameState.lastX) * sensitivity;
    const yoffset = (gameState.lastY - e.clientY) * sensitivity;
    gameState.lastX = e.clientX;
    gameState.lastY = e.clientY;

    gameState.yaw += xoffset;
    gameState.pitch += yoffset;

    if (gameState.pitch > 89.0) gameState.pitch = 89.0;
    if (gameState.pitch < -89.0) gameState.pitch = -89.0;

    const front = [
        Math.cos(radians(gameState.yaw)) * Math.cos(radians(gameState.pitch)),
        Math.sin(radians(gameState.pitch)),
        Math.sin(radians(gameState.yaw)) * Math.cos(radians(gameState.pitch))
    ];
    gameState.cameraFront = vec3.normalize([], front);
});

function radians(degrees) {
    return degrees * Math.PI / 180;
}

function updateCameraPosition(deltaTime) {
    const front = vec3.create();
    vec3.scale(front, gameState.cameraFront, gameState.movementSpeed * deltaTime);
    front[1] = 0; // Keep movement horizontal
    vec3.normalize(front, front);
    
    const right = vec3.create();
    vec3.cross(right, gameState.cameraFront, gameState.cameraUp);
    vec3.normalize(right, right);
    vec3.scale(right, right, gameState.movementSpeed * deltaTime);
    right[1] = 0; // Keep movement horizontal

    const moveDir = [0, 0, 0];
    if (keys.has('w')) vec3.add(moveDir, moveDir, front);
    if (keys.has('s')) vec3.sub(moveDir, moveDir, front);
    if (keys.has('a')) vec3.sub(moveDir, moveDir, right);
    if (keys.has('d')) vec3.add(moveDir, moveDir, right);

    // Povećana brzina kretanja u stranu
    const moveSpeed = vec3.length(moveDir);
    if (moveSpeed > 0) {
        vec3.normalize(moveDir, moveDir);
        vec3.scale(moveDir, moveDir, gameState.movementSpeed * deltaTime * (moveSpeed > 0 ? 1.5 : 1));
    }

    // Apply movement to velocity (for collision)
    gameState.velocity[0] = moveDir[0];
    gameState.velocity[2] = moveDir[2];
}

function shootArrow() {
    // Jačina pucnja zavisi od vremena držanja
	if (gameState.chargeTime > gameState.maxChargeTime) gameState.chargeTime = gameState.maxChargeTime;
    const chargeRatio = gameState.chargeTime / gameState.maxChargeTime;
    const speed =  gameState.arrowSpeed * (0.5 + chargeRatio * 20); // Brzina od 50% do 200%
    
    const arrow = {
        position: [...gameState.cameraPos],
        direction: [...gameState.cameraFront],
        speed: speed,
        lifetime: 10,
        gravity: true ,
		stuck: false,
		stuckPosition: null,
		sruckNormal: [0,1,0]// Dodajemo gravitaciju strelama
    };
    gameState.arrows.push(arrow);
}
function checkArrowCollisions() {
    for (let i = gameState.arrows.length - 1; i >= 0; i--) {
        const arrow = gameState.arrows[i];
        if (arrow.stuck) continue;

        // Provera kolizije sa metom
        if (vec3.distance(arrow.position, gameState.targetPos) < 2.0) {
            arrow.stuck = true;
            arrow.stuckPosition = [...arrow.position];
            gameState.showHitMessage = true;
            gameState.hitMessageTime = 1.5;
            continue;
        }

        // Provera kolizije sa zemljom (y < 0)
        if (arrow.position[1] < 0) {
            arrow.stuck = true;
            arrow.stuckPosition = [...arrow.position];
            arrow.stuckPosition[1] = 0; // Postavi na površinu zemlje
            continue;
        }
    }
}
function updateArrows(deltaTime) {
    for (let i = gameState.arrows.length - 1; i >= 0; i--) {
        const arrow = gameState.arrows[i];
        if (arrow.stuck) continue;
    
        // Ažuriranje pozicije strele
         vec3.scaleAndAdd(arrow.position, arrow.position, arrow.direction, arrow.speed * deltaTime);
         
		 
        // Primena gravitacije na strelu
        if (arrow.gravity) {
            arrow.direction[1] -= 0.5 * deltaTime; // Pad strele
            vec3.normalize(arrow.direction, arrow.direction); // Normalizujemo smer
        }
        
       

        // Provera kolizije sa metom
        if (checkArrowTargetCollision(arrow.position, gameState.targetPos)) {
            gameState.arrows.splice(i, 1);
            gameState.targetPos = [
                getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10), 
                0, 
                getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10)
            ];
            continue;
        }

        // Uklanjanje strele ako je isteklo vreme ili je van granica
        if (arrow.lifetime <= 0 || 
            Math.abs(arrow.position[0]) > gameState.groundSize || 
            Math.abs(arrow.position[2]) > gameState.groundSize ||
            arrow.position[1] < 0) { // Ako padne na zemlju
            gameState.arrows.splice(i, 1);
        }
    }
}

function checkArrowTargetCollision(arrowPos, targetPos) {
    const distance = vec3.distance(arrowPos, targetPos);
    return distance < gameState.targetSize;
}

function checkPlayerGroundCollision() {
    // Provera kolizije sa zemljom
    if (gameState.cameraPos[1] <= 1.8) {
        gameState.cameraPos[1] = 1.8;
        gameState.velocity[1] = 0;
        gameState.onGround = true;
        gameState.isJumping = false;
    } else {
        gameState.onGround = false;
    }
}
function drawHitMessage() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    ctx.font = '48px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('HIT!', canvas.width/2, canvas.height/2);
}

function checkPlayerBoundaryCollision() {
    // Čuvanje igrača unutar granica terena
    const halfPlayerSize = gameState.playerSize[0] / 2;
    if (gameState.cameraPos[0] > gameState.groundSize - halfPlayerSize) gameState.cameraPos[0] = gameState.groundSize - halfPlayerSize;
    if (gameState.cameraPos[0] < -gameState.groundSize + halfPlayerSize) gameState.cameraPos[0] = -gameState.groundSize + halfPlayerSize;
    if (gameState.cameraPos[2] > gameState.groundSize - halfPlayerSize) gameState.cameraPos[2] = gameState.groundSize - halfPlayerSize;
    if (gameState.cameraPos[2] < -gameState.groundSize + halfPlayerSize) gameState.cameraPos[2] = -gameState.groundSize + halfPlayerSize;
}

function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
}

document.getElementById('play-button').addEventListener('click', () => {
    document.getElementById('ui-overlay').style.display = 'none';
    gameState.gameStarted = true;
    document.body.requestPointerLock = document.body.requestPointerLock || 
                                      document.body.mozRequestPointerLock || 
                                      document.body.webkitRequestPointerLock;
    document.body.requestPointerLock();
});

async function main() {
    const gl = WebGLUtils.initWebGL();
    WebGLUtils.resizeCanvasToWindow(gl);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    const program = await WebGLUtils.createProgram(gl, "vertex-shader.glsl", "fragment-shader.glsl");
    gl.useProgram(program);

    // Učitavanje modela
    const groundVertices = await WebGLUtils.loadOBJ("../shapes/ground.obj");
    const groundVAO = WebGLUtils.createVAO(gl, program, groundVertices, 8, [
        { name: "in_position", size: 3, offset: 0 },
    ]);

    const cubeVertices = await loadOBJ_noIndices("../shapes/target.obj");
    const targetVAO = gl.createVertexArray();
    gl.bindVertexArray(targetVAO);

    const FLOAT_SIZE = 4;
    const stride = 8 * FLOAT_SIZE;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "in_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, stride, 0);

    // Učitavanje modela strele
    const arrowVertices = await loadOBJ_noIndices("../shapes/arrowTurned.obj");
    const arrowVAO = gl.createVertexArray();
    gl.bindVertexArray(arrowVAO);

    const arrowPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, arrowPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, arrowVertices, gl.STATIC_DRAW);

    const arrowPositionLocation = gl.getAttribLocation(program, "in_position");
    gl.enableVertexAttribArray(arrowPositionLocation);
    gl.vertexAttribPointer(arrowPositionLocation, 3, gl.FLOAT, false, stride, 0);

    gl.bindVertexArray(null);

    // Inicijalizacija pozicije mete
    gameState.targetPos = [
        getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10), 
        0, 
        getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10)
    ];

    function render(currentTime) {
        if (!gameState.lastTime) gameState.lastTime = currentTime;
        const deltaTime = (currentTime - gameState.lastTime) / 1000;
        gameState.lastTime = currentTime;

        if (!gameState.gameStarted) {
            requestAnimationFrame(render);
            return;
        }

        // Ažuriranje stanja igre
        updateCameraPosition(deltaTime);
        
        // Punjenje pucnja ako držimo dugme
        if ((keys.has('x') || (document.pointerLockElement && document.mouseIsDown)) && gameState.canShoot) {
            gameState.chargeTime += deltaTime;
        }
        
        // Primena gravitacije
        gameState.velocity[1] += gameState.gravity * deltaTime;
        
        // Ažuriranje pozicije na osnovu brzine
        vec3.scaleAndAdd(gameState.cameraPos, gameState.cameraPos, gameState.velocity, deltaTime);
        
        // Provera kolizija
        checkPlayerGroundCollision();
        checkPlayerBoundaryCollision();
        
        // Ažuriranje pucanja
        if (!gameState.canShoot) {
            gameState.shootTimer -= deltaTime;
            if (gameState.shootTimer <= 0) {
                gameState.canShoot = true;
            }
        }
        
        updateArrows(deltaTime);

        // Priprema matrica
        const projectionMat = mat4.create();
        const viewMat = mat4.create();
        const modelMatGround = mat4.create();
        const modelMatTarget = mat4.create();
        const mvpMatGround = mat4.create();
        const mvpMatTarget = mat4.create();

        mat4.perspective(projectionMat, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 1000);
        mat4.lookAt(viewMat, gameState.cameraPos, vec3.add([], gameState.cameraPos, gameState.cameraFront), gameState.cameraUp);

        // Crtanje tla
        mat4.identity(modelMatGround);
        mat4.multiply(mvpMatGround, projectionMat, viewMat);
        mat4.multiply(mvpMatGround, mvpMatGround, modelMatGround);

        // Crtanje mete
        mat4.identity(modelMatTarget);
        mat4.scale(modelMatTarget, modelMatTarget, [0.02, 0.02, 0.02]);
        mat4.translate(modelMatTarget, modelMatTarget, gameState.targetPos);
        mat4.multiply(mvpMatTarget, projectionMat, viewMat);
        mat4.multiply(mvpMatTarget, mvpMatTarget, modelMatTarget);

        gl.clearColor(0.2, 0.2, 0.3, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.useProgram(program);
        const u_mvp = gl.getUniformLocation(program, "u_mvp");
        const u_color = gl.getUniformLocation(program, "u_color");

        // Crtanje mete
        gl.bindVertexArray(targetVAO);
        gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
        gl.uniform3fv(u_color, [1, 0, 0]);
        const vertexCount = cubeVertices.length / 8;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        gl.bindVertexArray(null);

        // Crtanje tla
        gl.bindVertexArray(groundVAO);
        gl.uniformMatrix4fv(u_mvp, false, mvpMatGround);
        gl.uniform3fv(u_color, [0.1, 0.5, 0.1]);
        gl.drawArrays(gl.TRIANGLES, 0, groundVertices.length / 8);
        gl.bindVertexArray(null);

        // Crtanje strela
        gl.bindVertexArray(arrowVAO);
        gl.uniform3fv(u_color, [0.8, 0.8, 0]);
        for (const arrow of gameState.arrows) {
            const modelMatArrow = mat4.create();
            mat4.translate(modelMatArrow, modelMatArrow, arrow.position);
            
            // Rotacija strele u pravcu kretanja
            const angleToFront = Math.atan2(arrow.direction[0], arrow.direction[2]);
            mat4.rotateY(modelMatArrow, modelMatArrow, angleToFront);
            
            // Dodatna rotacija za pravilno postavljanje strele
            const verticalAngle = Math.asin(-arrow.direction[1]);
            mat4.rotateX(modelMatArrow, modelMatArrow, verticalAngle);
			
            
            const mvpMatArrow = mat4.create();
            mat4.multiply(mvpMatArrow, projectionMat, viewMat);
            mat4.multiply(mvpMatArrow, mvpMatArrow, modelMatArrow);
            
            gl.uniformMatrix4fv(u_mvp, false, mvpMatArrow);
            gl.drawArrays(gl.TRIANGLES, 0, arrowVertices.length / 8);
        }
        gl.bindVertexArray(null);

        requestAnimationFrame(render);
    }

    render(0);
}

main();

async function loadOBJ_noIndices(url) {
    const text = await fetch(url).then(res => res.text());
    const positions = [];
    const finalVertices = [];

    const lines = text.split('\n');
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith('v ')) {
            const [, x, y, z] = line.split(/\s+/);
            positions.push([parseFloat(x), parseFloat(y), parseFloat(z)]);
        } else if (line.startsWith('f ')) {
            const verts = line.slice(2).trim().split(/\s+/);
            if (verts.length === 3) {
                for (const v of verts) {
                    const posIndex = parseInt(v.split('/')[0]) - 1;
                    finalVertices.push(...positions[posIndex], 0, 0, 0, 0, 0);
                }
            } else if (verts.length === 4) {
                for (let i of [0, 1, 2]) {
                    const posIndex = parseInt(verts[i].split('/')[0]) - 1;
                    finalVertices.push(...positions[posIndex], 0, 0, 0, 0, 0);
                }
                for (let i of [0, 2, 3]) {
                    const posIndex = parseInt(verts[i].split('/')[0]) - 1;
                    finalVertices.push(...positions[posIndex], 0, 0, 0, 0, 0);
                }
            }
        }
    }

    return new Float32Array(finalVertices);
}

// Dodatak za praćenje stanja miša
document.mouseIsDown = false;
document.addEventListener('mousedown', () => document.mouseIsDown = true);
document.addEventListener('mouseup', () => document.mouseIsDown = false);
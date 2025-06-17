import WebGLUtils from '../WebGLUtils.js';
import { mat4, vec3 } from 'https://cdn.jsdelivr.net/npm/gl-matrix@3.4.0/+esm';

// Game state
let gameState = {
    cameraPos: [0, 2, 5],
    cameraFront: [0, 0, -1],
    cameraUp: [0, 1, 0],
    yaw: -90,
    pitch: 0,
    lastX: 0,
    lastY: 0,
    firstMouse: true,
    velocity: [0, 0, 0],
    gravity: -15,
    isJumping: false,
    onGround: true,
    showHitMessage: false,
    mouseLocked: false,
    hitMessageDuration: 0,
    jumpForce: 8,
    movementSpeed: 150,
    arrows: [],
    arrowSpeed: 10,
    canShoot: true,
    shootCooldown: 0.3,
    shootTimer: 0,
    chargeTime: 0,
    maxChargeTime: 3,
    targetPos: [15, 0, 15],
    targetMovement: 0,
    targetSpeed: 0,
    groundSize: 100,
    targetSize: 1.5,
    playerSize: [0.5, 1.8, 0.5],
    gameStarted: false,
    lastTime: 0,
    timeLeft: 60,
    gameEnded: false,
    score: 0
};
const style = document.createElement('style');
style.textContent = `
    body {
        cursor: none;
    }
    .crosshair {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
    .crosshair::before, .crosshair::after {
        content: '';
        position: absolute;
        background: white;
    }
    .crosshair::before {
        width: 2px;
        height: 20px;
        left: 9px;
        top: 0;
    }
    .crosshair::after {
        width: 20px;
        height: 2px;
        left: 0;
        top: 9px;
    }
`;
document.head.appendChild(style);
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
    
    if (key === 'x' && gameState.canShoot) {
        gameState.chargeTime = 0;
    }
});
const crosshair = document.createElement('div');
crosshair.className = 'crosshair';
document.body.appendChild(crosshair);

document.addEventListener('keyup', e => {
    const key = e.key.toLowerCase();
    keys.delete(key);
    
    if (key === 'x' && gameState.canShoot && gameState.chargeTime > 0) {
        shootArrow();
        gameState.canShoot = false;
        gameState.shootTimer = gameState.shootCooldown;
    }
});

document.addEventListener('mousedown', e => {
    if (e.button === 0 && gameState.canShoot) {
        gameState.chargeTime = 0;
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
    if (!gameState.gameStarted || gameState.gameEnded) return;
    
    if (gameState.firstMouse) {
        gameState.lastX = e.clientX;
        gameState.lastY = e.clientY;
        gameState.firstMouse = false;
    }

    const sensitivity = 0.2;
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
    front[1] = 0;
    vec3.normalize(front, front);
    
    const right = vec3.create();
    vec3.cross(right, gameState.cameraFront, gameState.cameraUp);
    vec3.normalize(right, right);
    vec3.scale(right, right, gameState.movementSpeed * deltaTime);
    right[1] = 0;

    const moveDir = [0, 0, 0];
    if (keys.has('w')) vec3.add(moveDir, moveDir, front);
    if (keys.has('s')) vec3.sub(moveDir, moveDir, front);
    if (keys.has('a')) vec3.sub(moveDir, moveDir, right);
    if (keys.has('d')) vec3.add(moveDir, moveDir, right);

    const moveSpeed = vec3.length(moveDir);
    if (moveSpeed > 0) {
        vec3.normalize(moveDir, moveDir);
        vec3.scale(moveDir, moveDir, gameState.movementSpeed * deltaTime * (moveSpeed > 0 ? 1.5 : 1));
    }

    gameState.velocity[0] = moveDir[0];
    gameState.velocity[2] = moveDir[2];
}

function shootArrow() {
    if (gameState.chargeTime > gameState.maxChargeTime) gameState.chargeTime = gameState.maxChargeTime;
    const chargeRatio = gameState.chargeTime / gameState.maxChargeTime;
    const speed = gameState.arrowSpeed * (0.5 + chargeRatio * 20);
    
    const arrow = {
        position: [...gameState.cameraPos],
        direction: [...gameState.cameraFront],
        speed: speed,
        lifetime: 10,
        gravity: true,
        stuck: false,
        stuckPosition: null,
        stuckNormal: [0,1,0]
    };
    gameState.arrows.push(arrow); 
}



function rayPlaneIntersection(origin, direction, planePoint, planeNormal) {
    const denom = vec3.dot(planeNormal, direction);
    if (Math.abs(denom) < 1e-6) {
        return null; // Parallel to plane
    }
    
    const t = vec3.dot(vec3.sub([], planePoint, origin), planeNormal) / denom;
    if (t < 0) {
        return null; // Behind the ray
    }
    
    return vec3.scaleAndAdd([], origin, direction, t);
}

// Helper function for ray-sphere intersection
function raySphereIntersection(origin, direction, center, radius) {
    const oc = vec3.sub([], origin, center);
    const a = vec3.dot(direction, direction);
    const b = 2 * vec3.dot(oc, direction);
    const c = vec3.dot(oc, oc) - radius * radius;
    
    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
        return null; // No intersection
    }
    
    const t = (-b - Math.sqrt(discriminant)) / (2 * a);
    if (t < 0) {
        return null; // Behind the ray
    }
    
    return vec3.scaleAndAdd([], origin, direction, t);
}


function updateArrows(deltaTime) {
    for (let i = gameState.arrows.length - 1; i >= 0; i--) {
        const arrow = gameState.arrows[i];
        
        if (arrow.stuck) {
            arrow.lifetime -= deltaTime;
            if (arrow.lifetime <= 0) {
                gameState.arrows.splice(i, 1);
            }
            continue;
        }
        
        // Calculate movement vector
        const moveVector = vec3.scale([], arrow.direction, arrow.speed * deltaTime);
        const startPos = [...arrow.position];
        const endPos = vec3.add([], startPos, moveVector);
        
        // Check for collisions along the path
        let collisionPoint = null;
        let hitTarget = false;
        
        // Check collision with target (using ray-sphere)
        const sphereHit = raySphereIntersection(
            startPos, 
            vec3.normalize([], moveVector), 
            vec3.add([], gameState.targetPos, [0, gameState.targetSize / 2, 0]), 
            gameState.targetSize / 2
        );
        
        if (sphereHit && vec3.distance(startPos, sphereHit) <= vec3.length(moveVector)) {
            collisionPoint = sphereHit;
            hitTarget = true;
        }
        
        // Check collision with ground (using ray-plane) if no target hit
        if (!collisionPoint) {
            const groundHit = rayPlaneIntersection(
                startPos,
                vec3.normalize([], moveVector),
                [0, 0, 0],  // Point on plane
                [0, 1, 0]   // Plane normal (up)
            );
            
            if (groundHit && vec3.distance(startPos, groundHit) <= vec3.length(moveVector)) {
                collisionPoint = groundHit;
            }
        }
        
        // Handle collision
        if (collisionPoint) {
            arrow.position = collisionPoint;
            arrow.stuck = true;
            
            if (hitTarget) {
                gameState.showHitMessage = true;
                gameState.hitMessageDuration = 1.5;
                gameState.score++;
                document.getElementById('score').textContent = gameState.score;
                
                // Move target to new random position
                gameState.targetPos = [
                    getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10), 
                    0, 
                    getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10)
                ];
            }
            continue;
        }
        
        // No collision - update position normally
        arrow.position = endPos;
        
        // Apply gravity
        if (arrow.gravity) {
            arrow.direction[1] -= 0.5 * deltaTime;
            vec3.normalize(arrow.direction, arrow.direction);
        }
        
        // Remove arrows that go out of bounds
        if (Math.abs(arrow.position[0]) > gameState.groundSize || 
           Math.abs(arrow.position[2]) > gameState.groundSize ||
           arrow.lifetime <= 0) {
            gameState.arrows.splice(i, 1);
        }
    }
}


function checkPlayerGroundCollision() {
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
    if (!gameState.showHitMessage) return;
    
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear previous frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw hit message
    ctx.font = '48px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('HIT!', canvas.width/2, canvas.height/2);
    
    // Update message duration
    gameState.hitMessageDuration -= 0.016; // Assuming ~60fps
    if (gameState.hitMessageDuration <= 0) {
        gameState.showHitMessage = false;
    }
}

function checkPlayerBoundaryCollision() {
    const halfPlayerSize = gameState.playerSize[0] / 2;
    if (gameState.cameraPos[0] > gameState.groundSize - halfPlayerSize) gameState.cameraPos[0] = gameState.groundSize - halfPlayerSize;
    if (gameState.cameraPos[0] < -gameState.groundSize + halfPlayerSize) gameState.cameraPos[0] = -gameState.groundSize + halfPlayerSize;
    if (gameState.cameraPos[2] > gameState.groundSize - halfPlayerSize) gameState.cameraPos[2] = gameState.groundSize - halfPlayerSize;
    if (gameState.cameraPos[2] < -gameState.groundSize + halfPlayerSize) gameState.cameraPos[2] = -gameState.groundSize + halfPlayerSize;
}

function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
}

function updateTimer(deltaTime) {
    if (!gameState.gameStarted || gameState.gameEnded) return;
    
    gameState.timeLeft -= deltaTime;
    document.getElementById('timer').textContent = Math.ceil(gameState.timeLeft);
    
    if (gameState.timeLeft <= 0) {
        gameState.timeLeft = 0;
        gameState.gameEnded = true;
        endGame();
    }
}

function endGame() {
    const gameOverText = document.createElement("div");
    gameOverText.id = "game-over";
    gameOverText.innerHTML = `
        <div style="font-size: 72px; color: red; margin-bottom: 20px;">GAME OVER</div>
        <div style="font-size: 36px; color: white;">Final Score: ${gameState.score}</div>
    `;
    gameOverText.style.position = "absolute";
    gameOverText.style.top = "50%";
    gameOverText.style.left = "50%";
    gameOverText.style.transform = "translate(-50%, -50%)";
    gameOverText.style.textAlign = "center";
    gameOverText.style.fontFamily = "sans-serif";
    gameOverText.style.zIndex = "200";
    document.body.appendChild(gameOverText);
}

document.getElementById('play-button').addEventListener('click', () => {
    document.getElementById('ui-overlay').style.display = 'none';
    gameState.gameStarted = true;
    gameState.timeLeft = 60;
    gameState.score = 0;
    document.getElementById('timer').textContent = Math.ceil(gameState.timeLeft);
    document.getElementById('score').textContent = gameState.score;
    
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

    // Load models
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

    // Load arrow model
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

    // Initialize target position
    gameState.targetPos = [
        getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10), 
        0, 
        getRandomPosition(-gameState.groundSize + 10, gameState.groundSize - 10)
    ];

    function render(currentTime) {
        if (!gameState.lastTime) gameState.lastTime = currentTime;
        const deltaTime = (currentTime - gameState.lastTime) / 1000;
        gameState.lastTime = currentTime;

        if (!gameState.gameStarted || gameState.gameEnded) {
            requestAnimationFrame(render);
            return;
        }

        // Update game state
        updateTimer(deltaTime);
        updateCameraPosition(deltaTime);
        
        // Handle charging
        if ((keys.has('x') || (document.pointerLockElement && document.mouseIsDown)) && gameState.canShoot) {
            gameState.chargeTime += deltaTime;
        }
        
        // Apply gravity
        gameState.velocity[1] += gameState.gravity * deltaTime;
        
        // Update position
        vec3.scaleAndAdd(gameState.cameraPos, gameState.cameraPos, gameState.velocity, deltaTime);
        
        // Check collisions
        checkPlayerGroundCollision();
        checkPlayerBoundaryCollision();
        
        // Update shooting
        if (!gameState.canShoot) {
            gameState.shootTimer -= deltaTime;
            if (gameState.shootTimer <= 0) {
                gameState.canShoot = true;
            }
        }
        
        updateArrows(deltaTime);

        // Prepare matrices
        const projectionMat = mat4.create();
        const viewMat = mat4.create();
        const modelMatGround = mat4.create();
        const modelMatTarget = mat4.create();
        const mvpMatGround = mat4.create();
        const mvpMatTarget = mat4.create();

        mat4.perspective(projectionMat, Math.PI / 4, gl.canvas.width / gl.canvas.height, 0.1, 1000);
        mat4.lookAt(viewMat, gameState.cameraPos, vec3.add([], gameState.cameraPos, gameState.cameraFront), gameState.cameraUp);

        // Draw ground
        mat4.identity(modelMatGround);
        mat4.multiply(mvpMatGround, projectionMat, viewMat);
        mat4.multiply(mvpMatGround, mvpMatGround, modelMatGround);

        // Draw target
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

        // Draw target
        gl.bindVertexArray(targetVAO);
        gl.uniformMatrix4fv(u_mvp, false, mvpMatTarget);
        gl.uniform3fv(u_color, [1, 0, 0]);
        const vertexCount = cubeVertices.length / 8;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
        gl.bindVertexArray(null);

        // Draw ground
        gl.bindVertexArray(groundVAO);
        gl.uniformMatrix4fv(u_mvp, false, mvpMatGround);
        gl.uniform3fv(u_color, [0.1, 0.5, 0.1]);
        gl.drawArrays(gl.TRIANGLES, 0, groundVertices.length / 8);
        gl.bindVertexArray(null);

        // Draw arrows
        gl.bindVertexArray(arrowVAO);
        gl.uniform3fv(u_color, [0.8, 0.8, 0]);
        for (const arrow of gameState.arrows) {
            const modelMatArrow = mat4.create();
            mat4.translate(modelMatArrow, modelMatArrow, arrow.position);
            
            const angleToFront = Math.atan2(arrow.direction[0], arrow.direction[2]);
            mat4.rotateY(modelMatArrow, modelMatArrow, angleToFront);
            
            const verticalAngle = Math.asin(-arrow.direction[1]);
            mat4.rotateX(modelMatArrow, modelMatArrow, verticalAngle);
            
            const mvpMatArrow = mat4.create();
            mat4.multiply(mvpMatArrow, projectionMat, viewMat);
            mat4.multiply(mvpMatArrow, mvpMatArrow, modelMatArrow);
            
            gl.uniformMatrix4fv(u_mvp, false, mvpMatArrow);
            gl.drawArrays(gl.TRIANGLES, 0, arrowVertices.length / 8);
        }
        document.getElementById('play-button').addEventListener('click', () => {
            document.getElementById('ui-overlay').style.display = 'none';
            gameState.gameStarted = true;
            
            // Zakljucaj mi�a i sakrij ga
            canvas.requestPointerLock = canvas.requestPointerLock || 
                                      canvas.mozRequestPointerLock || 
                                      canvas.webkitRequestPointerLock;
            canvas.requestPointerLock();
            
            // Postavi event listenere za pracenje pokreta mi�a
            document.addEventListener('pointerlockchange', lockChangeAlert, false);
            document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
            document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);
        gl.bindVertexArray(null);})

        // Draw hit message if needed
        if (gameState.showHitMessage) {
            drawHitMessage();
        }

        requestAnimationFrame(render);
    }

    render(0);
}


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

// Mouse state tracking
document.mouseIsDown = false;
document.addEventListener('mousedown', () => document.mouseIsDown = true);
document.addEventListener('mouseup', () => document.mouseIsDown = false);

main();

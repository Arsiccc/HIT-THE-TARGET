let x = 0;
let y = 0;
let hitted = false;
let level = 1;

export function initPhysics(startLevel = 1) {
  level = startLevel;
  randomizePosition();
}

export function randomizePosition() {
  x = Math.random() * 1.6 - 0.8; // između -0.8 i 0.8
  y = Math.random() * 1.6 - 0.8; // između -0.8 i 0.8
  hitted = false;
}

export function updatePosition() {
  // ništa se ne menja jer nema kretanja
}

export function getPosition() {
  return { x, y };
}

export function hit() {
  hitted = true;
}

export function isHitted() {
  return hitted;
}

export function nextLevel() {
  level++;
  randomizePosition();
}

export function getLevel() {
  return level;
}

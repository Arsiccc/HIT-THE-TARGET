let x = 0;
let y = 0;
let hitted = false;
let level = 1;

export function initTarget(startLevel = 1) {
  level = startLevel;
  randomizeTargetPosition();
}

export function randomizeTargetPosition() {
  x = Math.random() * 1.6 - 0.8; // random između -0.8 i 0.8 po X
  y = Math.random() * 1.6 - 0.8; // random između -0.8 i 0.8 po Y
  hitted = false;
}

export function updateTarget() {
  // meta se ne pomera — prazna funkcija
}

export function getTargetPosition() {
  return { x, y };
}

export function hitTarget() {
  hitted = true;
}

export function isTargetHitted() {
  return hitted;
}

export function nextLevel() {
  level++;
  randomizeTargetPosition();
}

export function getLevel() {
  return level;
}

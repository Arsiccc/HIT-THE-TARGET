let x = 0;
let y =Math.random() * (maxDistance - minDistance) + minDistance;
let speed = Math.random() * (max - min) + min;
let minPosition = -1.0;
let maxPosition = 1.0;
let hitted = false;

function update() {
    if (!hitted) {
        x += speed;

        // promena pravca kad dotakne ivice
        if (x > maxPosition || x < minPosition) {
            speed = -speed;
        }
    }

    // ovde šalješ poziciju u shader kao uniformu, npr.:
    gl.uniform2f(positionUniformLocation, x, y);

    drawScene();
    requestAnimationFrame(update);
}

update();

import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const groundGeometry = new THREE.BoxGeometry( 18, 1, 1);
const groundMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const ground = new THREE.Mesh( groundGeometry, groundMaterial );

const targetGeometry = new THREE.CircleGeometry( 0.5, 32 );
const targetMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const target = new THREE.Mesh( targetGeometry, targetMaterial );

ground.position.y -= 3
target.position.y += 3;
scene.add( ground );
scene.add( target );

camera.position.z = 5;

    function animate() {

    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;


      renderer.render( scene, camera );

    }
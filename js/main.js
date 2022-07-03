import * as THREE from 'three';
import { TWEEN } from 'tween';


var sound = new Audio("https://cdn.discordapp.com/attachments/717384261354651649/993178003360198676/ding.mp3");

// Scene
const scene = new THREE.Scene();
// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(3, -1, 7);
camera.lookAt(0,0,0)

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});

// Create u shape
var path = new THREE.Shape(); // create a U-shape with its parts
path.moveTo(-1, 1);

path.absarc(0, 0, 1, Math.PI, Math.PI * 2)
path.absarc(.9,1.7, .1, Math.PI * 2, Math.PI, false);
path.absarc(0, 0, .8, Math.PI * 2, Math.PI, true);
path.absarc(-.9,1.7, .1, Math.PI * 2, Math.PI, false);

var extOpt = { // options of extrusion
    steps: 100,
    curveSegments: 50,
    depth: .2,
    bevelOffset: .22,
    bevelSegments: 10
}
var uGeometry = new THREE.ExtrudeGeometry(path, extOpt); // create a geometry
uGeometry.center(); // center the geometry

//  Black u
const blackMaterial = new THREE.MeshStandardMaterial( {
    color: 0x171717,
    metalness: 0.8,   // between 0 and 1
    roughness: 0.3, // between 0 and 1
} );
var blackMesh = new THREE.Mesh(uGeometry, blackMaterial);
//scene.add(blackMesh);

// Silver u
const silverMaterial = new THREE.MeshStandardMaterial( {
    color: 0xaeadb8,
    metalness: 1,   // between 0 and 1
    roughness: 0.5, // between 0 and 1
} );
var silverMesh = new THREE.Mesh(uGeometry, silverMaterial);
//scene.add(silverMesh);

silverMesh.rotation.z = Math.PI;
silverMesh.position.set(-0.9,0.9,0);


const group = new THREE.Group();
group.add(silverMesh);
group.add(blackMesh);
scene.add(group);


// Lights
const lights = [];
const lightValues = [
    {colour: 0xffffff, intensity: 8, dist: 12, x: 1, y: 0, z: 8},
    {colour: 0xffffff, intensity: 6, dist: 12, x: -2, y: 1, z: -10},
    {colour: 0xffffff, intensity: 3, dist: 10, x: 0, y: 10, z: 1},
    {colour: 0xffffff, intensity: 6, dist: 12, x: 0, y: -10, z: -1},
    {colour: 0xffffff, intensity: 6, dist: 12, x: 10, y: 3, z: 0},
    {colour: 0xffffff, intensity: 6, dist: 12, x: -10, y: -1, z: 0}
];
for (let i=0; i<6; i++) {
    lights[i] = new THREE.PointLight(
        lightValues[i]['colour'],
        lightValues[i]['intensity'],
        lightValues[i]['dist']);
    lights[i].position.set(
        lightValues[i]['x'],
        lightValues[i]['y'],
        lightValues[i]['z']);
    scene.add(lights[i]);
}

let tween = new TWEEN.Tween(group.rotation)
    .to({x:"-" + (Math.PI/2)*4}, 800)
    .easing(TWEEN.Easing.Quartic.Out);


renderer.setClearColor("#0018ff", 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Make Canvas Responsive
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})
window.addEventListener('click', function () {
    group.rotation.x = 0;
    sound.load();
    sound.play();
    tween.start();
})
let clock = new THREE.Clock();

const animate = function() {
    requestAnimationFrame(animate);
    TWEEN.update();
    renderer.render(scene, camera);
    const time = clock.getElapsedTime();
    group.position.y = Math.cos(time) * 0.2;
    group.position.x = Math.sin(time) * 0.05;
    group.position.z = Math.cos(time) * 0.07;
    group.rotation.z = Math.cos(time) * 0.02;
    group.rotation.y = Math.cos(time) * 0.1;
};
animate();

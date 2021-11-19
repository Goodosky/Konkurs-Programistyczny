import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function startBoatGame() {
  // Scene
  const scene = new THREE.Scene();

  // Renderer
  const canvas = document.querySelector("#gameCanvasBoard");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Camera
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1);
  sunLight.position.set(5, 10, 2);
  scene.add(sunLight);

  // Axis
  var axis = new THREE.AxesHelper(10);
  scene.add(axis);

  // Grid
  var grid = new THREE.GridHelper(30, 30);
  scene.add(grid);

  // Animate
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

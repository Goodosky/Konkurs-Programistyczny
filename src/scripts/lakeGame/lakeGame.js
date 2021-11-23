import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Boat } from "./boat";
import { EventHandler } from "./eventHandler";
import { WaterSurface } from "./waterSurface";

export function startBoatGame() {
  // Scene
  const scene = new THREE.Scene();

  // Renderer
  const canvas = document.querySelector("#gameCanvasBoard");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Camera
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 20);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfdfaf1, 1.5);
  sunLight.position.set(15, 1, 0);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // Axis
  var axis = new THREE.AxesHelper(10);
  scene.add(axis);

  // Grid
  const grid = new THREE.GridHelper(30, 30);
  scene.add(grid);

  // Water surface
  const waterSurface = new WaterSurface(scene);

  // Render Colliders
  const collider = new THREE.Mesh(new THREE.BoxGeometry(1, 1), new THREE.MeshNormalMaterial({}));
  collider.position.set(15, 1, 0);
  scene.add(collider);

  const collider2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1), new THREE.MeshPhongMaterial({ color: 0x00ffff }));
  collider2.position.set(5, 5, 0);
  scene.add(collider2);

  const coliders = [collider];

  // Render Boat
  const boat = new Boat();
  boat.loadModel(scene, coliders);

  // Add event handlers
  new EventHandler(boat);

  // Animate
  function animate() {
    waterSurface.animate();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

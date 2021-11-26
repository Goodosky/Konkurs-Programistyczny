import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Boat } from "./boat";
import { EventHandler } from "./eventHandler";
import { WaterSurface } from "./waterSurface";
import { Terrain } from "./terrain";

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
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfdfaf1, 1);
  sunLight.position.set(15, 1, 0);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // Axis
  var axis = new THREE.AxesHelper(10);
  axis.position.y = 1;
  scene.add(axis);

  // Water surface
  const waterSurface = new WaterSurface(scene);

  // Terrain
  const terrain = new Terrain(scene);
  console.log("terrain:", terrain);

  // Render collision walls
  // ...

  // Render Boat
  const boat = new Boat(scene);

  // Add event handlers
  new EventHandler(boat);

  // Animate
  function animate() {
    waterSurface.animate();
    boat.animate();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

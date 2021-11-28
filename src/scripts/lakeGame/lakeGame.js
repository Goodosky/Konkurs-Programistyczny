import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { Boat } from "./boat";
import { EventHandler } from "./eventHandler";
import { WaterSurface } from "./waterSurface";
import { Terrain } from "./terrain";
import { GameLogic } from "./gameLogic";
import { Pointer } from "./pointer";

export function startBoatGame(dataForHUD, userSettings) {
  // Canvas
  const canvas = document.querySelector("#gameCanvasBoard");
  const canvasWidth = window.innerWidth - 300;
  const canvasHeight = window.innerHeight;

  // Scene
  const scene = new THREE.Scene();

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setSize(canvasWidth, canvasHeight);

  // Camera
  const camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 1000);
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

  // Stats
  const stats = new Stats();
  document.body.appendChild(stats.dom);

  // Clock
  const clock = new THREE.Clock();

  // Water surface
  const waterSurface = new WaterSurface(scene);

  // Terrain
  const terrain = new Terrain(scene, userSettings.graphicQuality);
  console.log("terrain:", terrain);

  // Render collision walls
  // ...

  // Render Boat
  const boat = new Boat(scene);

  // Init Game logic
  const gameLogic = new GameLogic(dataForHUD);

  // Add event handlers
  new EventHandler(boat, dataForHUD);

  // Pointer
  const pointer = new Pointer(scene);

  // Animate
  function animate() {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);

    controls.update();
    stats.update();

    // Skip animations if the boat hasn't loaded yet
    if (!boat._modelLoaded) return;

    // Get the seconds passed since last frame
    const timeDelta = clock.getDelta();

    // Animate things
    pointer.animate();
    waterSurface.animate(timeDelta);
    boat.animate(timeDelta);
    gameLogic.updateTime(timeDelta);

    // Handle the pointer capture
    if (dataForHUD.timeToStart <= 0 && boat._collisionDetector.checkCollision(pointer.pointerObj)) {
      pointer.putInRandomPlace();
      gameLogic.nextLevel();
    }
  }

  animate();
}

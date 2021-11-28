import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
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
  camera.position.set(-26, 15, 15);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 0, 0);
  controls.maxPolarAngle = Math.PI / 2 - 0.2;

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfdfaf1, 1);
  sunLight.position.set(15, 1, 0);
  sunLight.castShadow = true;
  scene.add(sunLight);

  // Clock
  const clock = new THREE.Clock();

  // Water surface
  const waterSurface = new WaterSurface(scene);

  // Terrain
  const terrain = new Terrain(scene);

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
    if (userSettings.cameraRotation == "on") {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }

    // Generate forrest if it is needed
    if (userSettings.graphicQuality == "normal" && dataForHUD.gameStarted && !terrain.forrestGenerate) {
      terrain.genereteForest();
    }

    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(animate);

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

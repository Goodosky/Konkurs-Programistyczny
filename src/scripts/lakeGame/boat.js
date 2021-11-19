import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { CollisionManager } from "./collisionManager";

export class Boat {
  constructor() {
    this._boat = undefined;
    this._modelLoaded = false;
    this._speed = 0;
    this._maxSpeed = 0.03;
  }

  loadModel(scene, coliders) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("/models/BoatWSail.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("/models/BoatWSail.obj", (boat) => {
        scene.add(boat);
        this._boat = boat;
        this._collisionManager = new CollisionManager(boat, coliders);
        this._modelLoaded = true;
      });
    });
  }

  moveFoward() {
    if (this._modelLoaded && this._speed == 0) {
      clearInterval(this._interval);
      this._interval = setInterval(() => {
        //   Increase speed
        if (this._speed < this._maxSpeed) {
          this._speed += 0.0004;
        }

        // Check collision
        if (this._collisionManager.checkCollision()) {
          clearInterval(this._interval);
          this._speed = 0;
        }

        // Move boat
        this._boat.position.z += this._speed;

        console.log("this._speed:", this._speed);
      }, 10);
    }
  }

  moveStop() {
    // Clear interval from moveFoward
    clearInterval(this._interval);

    // Crete new interval to slow down
    this._interval = setInterval(() => {
      // Check collision
      if (this._collisionManager.checkCollision()) {
        clearInterval(this._interval);
        this._speed = 0;
      }

      // Slow down
      if (this._speed > 0.001) {
        this._speed -= 0.0006;
      } else {
        this._speed = 0;
        clearInterval(this._interval);
      }
      // Move boat
      this._boat.position.z += this._speed;

      console.log("this._speed:", this._speed);
    }, 10);
  }
}

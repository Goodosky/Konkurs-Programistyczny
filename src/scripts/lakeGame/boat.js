import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { CollisionManager } from "./collisionManager";

export class Boat {
  constructor() {
    this._boat = undefined;
    this._modelLoaded = false;
    this._speed = 0;
    this._maxSpeed = 0.035;
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

  moveBoat(moveDirection) {
    if (this._modelLoaded) {
      clearInterval(this._speedInterval);
      this._speedInterval = setInterval(() => {
        //   Update speed
        if (moveDirection == "foward" && this._blockDirection != "foward" && this._speed < this._maxSpeed) {
          this._speed += 0.0002;
        } else if (moveDirection == "back" && this._blockDirection != "back" && this._speed > this._maxSpeed * -1) {
          this._speed -= 0.0002;
        }

        // Check collision
        if (this._collisionManager.checkCollision()) {
          clearInterval(this._speedInterval);
          if (!this._blockDirection) {
            this._blockDirection = moveDirection;
            this._speed = 0;
          }
        } else {
          this._blockDirection = undefined;
        }

        // Move boat
        this._boat.translateZ(this._speed);

        console.log("this._speed:", this._speed);
      }, 10);
    }
  }

  moveStop() {
    // Clear interval from moveFoward
    clearInterval(this._speedInterval);

    // Crete new interval to slow down
    this._speedInterval = setInterval(() => {
      // Check collision
      if (this._collisionManager.checkCollision()) {
        clearInterval(this._speedInterval);
        this._speed = 0;
      }

      // Slow down
      if (this._speed > 0.001) {
        this._speed -= 0.0004;
      } else if (this._speed < -0.001) {
        this._speed += 0.0004;
      } else if (this._speed != 0) {
        this._speed = 0;
        clearInterval(this._speedInterval);
      }
      // Move boat
      this._boat.translateZ(this._speed);

      console.log("this._speed:", this._speed);
    }, 10);
  }

  rotateBoat(rotationDirection) {
    this._rotationInterval = setInterval(() => {
      if (this._speed > 0.005 || this._speed < -0.005) {
        if (rotationDirection == "right") {
          this._boat.rotation.y -= 0.005;
        } else if (rotationDirection == "left") {
          this._boat.rotation.y += 0.005;
        }
      }
    }, 1);
  }

  rotationStop() {
    clearInterval(this._rotationInterval);
  }
}

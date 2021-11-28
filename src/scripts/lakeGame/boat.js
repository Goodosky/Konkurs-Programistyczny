import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { CollisionDetector } from "./collisionDetector";

export class Boat {
  constructor(scene) {
    this._boat = undefined;
    this._modelLoaded = false;

    this._accelerationMultiplier = 0.04;
    this._maxSpeedMultiplier = 3.5;
    this._rotationMultiplier = 0.75;

    this.speedFoward = 0;
    this.movement = {
      foward: false,
      backword: false,
      isSlowing: false,

      left: false,
      right: false,
      isTurningLeft: false,
      isTurningRight: false,
    };

    // Load model
    this.loadModel(scene);
  }

  loadModel(scene) {
    const loader = new FBXLoader();
    loader.load("/models/BoatWSail.fbx", (boat) => {
      boat.scale.multiplyScalar(0.012);
      boat.position.y = 0.05;
      scene.add(boat);

      this._boat = boat;
      this._collisionDetector = new CollisionDetector(boat);
      this._modelLoaded = true;
    });
  }

  moveBoat(moveDirection) {
    if (moveDirection == "foward") {
      this.movement.foward = true;
      this.movement.backword = false;
    } else if (moveDirection == "backword") {
      this.movement.foward = false;
      this.movement.backword = true;
    }
  }

  moveStop() {
    this.movement.isSlowing = true;
    this.movement.foward = false;
    this.movement.backword = false;
  }

  rotateBoat(rotationDirection) {
    if (rotationDirection == "right") {
      this.movement.isTurningRight = true;
      this.movement.isTurningLeft = false;
    } else if (rotationDirection == "left") {
      this.movement.isTurningRight = false;
      this.movement.isTurningLeft = true;
    }
  }

  rotationStop() {
    this.movement.isTurningRight = false;
    this.movement.isTurningLeft = false;
  }

  reduceSpeed(timeDelta, maxSpeed) {
    this.speedFoward = this.speedFoward * (1 - timeDelta * 2);

    if (this.speedFoward < maxSpeed * 0.1 && this.speedFoward > -maxSpeed * 0.1) {
      // The boat speed is near 0
      this.speedFoward = 0;
      this.movement.foward = false;
      this.movement.isSlowing = false;
    }
  }

  animate(timeDelta) {
    // Skip animation if model hasn't been loaded yet
    if (!this._modelLoaded) return;

    const acceleration = timeDelta * this._accelerationMultiplier;
    const rotation = timeDelta * this._rotationMultiplier;
    const maxSpeed = timeDelta * this._maxSpeedMultiplier;

    // reduce speed if is slowing
    if (this.movement.isSlowing) {
      this.reduceSpeed(timeDelta, maxSpeed);
    }

    // Update speed (speed up or slow down)
    if (this.movement.foward && this.speedFoward < maxSpeed && this._blockDirection != "foward") {
      this.speedFoward += acceleration;
      this.movement.isSlowing = false;
    } else if (this.movement.backword && this.speedFoward > maxSpeed * -1 && this._blockDirection != "backword") {
      this.speedFoward -= acceleration;
      this.movement.isSlowing = false;
    }

    // Check collision
    if (this._collisionDetector.checkCollisionWithCollisionWalls()) {
      if (!this._blockDirection) {
        this.moveStop();
        this._blockDirection = this.speedFoward > 0 ? "foward" : "backword";
        this.speedFoward = 0;
      }
    } else {
      this._blockDirection = undefined;
    }

    // Move Boat
    if (this.speedFoward) {
      // Move boat foward/backword
      this._boat.translateZ(this.speedFoward);

      // Rotate boat
      if (this.movement.isTurningRight && this.speedFoward > rotation) {
        // Rotate right. The boat is sailing foward
        this._boat.rotation.y -= rotation;
      } else if (this.movement.isTurningLeft && this.speedFoward > rotation) {
        // Rotate left. The boat is sailing foward
        this._boat.rotation.y += rotation;
      } else if (this.movement.isTurningRight && this.speedFoward < -rotation) {
        // Rotate right. The boat is sailing backward
        this._boat.rotation.y += rotation;
      } else if (this.movement.isTurningLeft && this.speedFoward < -rotation) {
        // Rotate left. The boat is sailing backward
        this._boat.rotation.y -= rotation;
      }
    }
  }
}

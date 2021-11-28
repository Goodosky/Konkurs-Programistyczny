import * as THREE from "three";
import { ColiderConstructor } from "./coliderConstructor";

export class CollisionDetector {
  constructor(boat) {
    this._boat = boat;

    const coliderConstructor = new ColiderConstructor();
    this._collisionWalls = coliderConstructor.getLakeColiders();
  }

  checkCollisionWithCollisionWalls() {
    // Update boat Box3
    const boatBox3 = new THREE.Box3().setFromObject(this._boat);

    for (const colider of this._collisionWalls) {
      if (boatBox3.intersectsBox(colider)) return true;
    }
  }

  checkCollision(colider) {
    // Update boat Box3
    const boatBox3 = new THREE.Box3().setFromObject(this._boat);

    // Create Box3 for colider if it need it
    const coliderBox3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
    coliderBox3.setFromObject(colider);

    // Check collision and return Bool
    return coliderBox3.intersectsBox(boatBox3);
  }
}

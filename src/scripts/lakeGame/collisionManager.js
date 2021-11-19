import * as THREE from "three";

export class CollisionManager {
  constructor(boat, colliders) {
    this._boat = boat;
    this._colidersBoxes3 = [];
    for (const colider of colliders) {
      const newBox3 = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
      newBox3.setFromObject(colider);
      this._colidersBoxes3.push(newBox3);
    }
  }

  checkCollision() {
    // Update boat Box3
    this._boatBox3 = new THREE.Box3().setFromObject(this._boat);

    // Check collision
    let isCollision = false;
    for (const colider of this._colidersBoxes3) {
      colider.intersectsBox(this._boatBox3) && (isCollision = true);
    }

    return isCollision;
  }
}

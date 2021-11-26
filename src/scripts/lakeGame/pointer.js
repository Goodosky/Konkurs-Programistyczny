import * as THREE from "three";

export class Pointer {
  constructor(scene) {
    this.LakeSize = {
      minX: -10,
      maxX: 10,
      minZ: -15,
      maxZ: 15,
      width: 20,
      height: 30,
    };

    this.pointerObj = this.createPointer();
    scene.add(this.pointerObj);

    this.putInRandomPlace();
  }

  createPointer() {
    // Create pointer
    const geometry = new THREE.DodecahedronGeometry(0.3);
    const material = new THREE.MeshNormalMaterial({});
    const pointer = new THREE.Mesh(geometry, material);

    pointer.position.y = 0.5;
    pointer.geometry.FlatShading = true;

    // Hide pointer
    pointer.visible = false;

    return pointer;
  }

  putInRandomPlace() {
    // Draw random place on the lake
    this.pointerObj.position.x = Math.random() * (this.LakeSize.width - 2) + this.LakeSize.minX + 1;
    this.pointerObj.position.z = Math.random() * (this.LakeSize.height - 2) + this.LakeSize.minZ + 1;

    // Show pointer
    this.pointerObj.visible = true;
  }

  hide() {
    // Hide pointer
    this.pointerObj.visible = false;
  }

  animate() {
    // Rotate pointer
    this.pointerObj.rotation.y += 0.01;
    this.pointerObj.rotation.x += 0.001;
  }
}

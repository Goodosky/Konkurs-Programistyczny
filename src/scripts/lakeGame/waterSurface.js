import * as THREE from "three";

export class WaterSurface {
  constructor(scene) {
    this.waterSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20, 40, 40),
      new THREE.MeshPhongMaterial({ color: 0x44ddff, side: THREE.DoubleSide })
    );
    this.waterSurface.rotation.x = Math.PI / 2;
    this.waterSurface.position.y = -0.02;
    scene.add(this.waterSurface);

    this.positionsArray = this.waterSurface.geometry.attributes.position.array;
    this.numberOfVertices = this.positionsArray.length;
    this.startPositions = [];
    for (let i = 2; i < this.numberOfVertices; i += 3) {
      this.startPositions[i] = Math.random() * 6;
    }
  }

  animate() {
    this.waterSurface.geometry.attributes.position.needsUpdate = true;

    for (let i = 2; i < this.numberOfVertices; i += 3) {
      this.positionsArray[i] = 0.1 * Math.sin(this.startPositions[i]);
      this.startPositions[i] += 0.008;
    }

    this.waterSurface.geometry.computeVertexNormals();
  }
}

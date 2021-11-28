import * as THREE from "three";

export class WaterSurface {
  constructor(scene) {
    // Create water surface mesh
    this.waterSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 30, 40, 40),
      new THREE.MeshPhongMaterial({
        color: 0x44ddff,
        side: THREE.BackSide,
        shininess: 150,
      })
    );
    this.waterSurface.material.flatShading = true;

    // Set position for water surface
    this.waterSurface.rotation.x = Math.PI / 2;
    this.waterSurface.position.y = -0.02;

    // Get data needed for animation
    this.positionsArray = this.waterSurface.geometry.attributes.position.array;
    this.numberOfVertices = this.positionsArray.length;
    this.startPositions = [];

    for (let i = 2; i < this.numberOfVertices; i += 3) {
      const randomNumber = Math.random() * 6.28;
      this.startPositions[i] = randomNumber;
      this.positionsArray[i] = 0.1 * Math.sin(randomNumber);
    }

    // Add to scene
    scene.add(this.waterSurface);
  }

  animate(timeDelta) {
    this.waterSurface.geometry.attributes.position.needsUpdate = true;

    for (let i = 2; i < this.numberOfVertices; i += 3) {
      this.positionsArray[i] = 0.1 * Math.sin(this.startPositions[i]);
      this.startPositions[i] += timeDelta * 0.45;
    }
  }
}

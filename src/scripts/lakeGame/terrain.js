import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export class Terrain {
  constructor(scene) {
    // Set class variables
    this.scene = scene;
    this.terrainSize = {
      startX: -25,
      startZ: -30,
      width: 55, // x
      height: 60, // z
    };

    // Forest settings
    this.numberOfTreeModels = 5;
    this.treesColors = [0x224e24, 0x293a16, 0x1c280f];
    this.treesScatter = 0.85;
    this.forrestFreeTerrains = {
      lake: {
        minX: -12,
        maxX: 12,
        minZ: -17,
        maxZ: 15.5,
      },
      farm: {
        minX: -4,
        maxX: 25,
        minZ: -3,
        maxZ: 25,
      },
    };

    // Generete terrain
    this.genereteTerrainSurface();
    this.genereteForest();
  }

  genereteTerrainSurface() {
    // Crete terrain mesh
    const terrainSurface = new THREE.Mesh(
      new THREE.PlaneGeometry(this.terrainSize.width, this.terrainSize.height, 30, 30),
      new THREE.MeshPhongMaterial({ color: 0x8bc34a, side: THREE.BackSide, shininess: 25 })
    );

    terrainSurface.material.flatShading = true;
    terrainSurface.rotation.x = Math.PI / 2;

    // Move the terrain so that it begins at the startX and startZ.
    terrainSurface.position.x += this.terrainSize.width / 2 + this.terrainSize.startX;
    terrainSurface.position.z += this.terrainSize.height / 2 + this.terrainSize.startZ;

    // Add noise to the terrain
    const positionsArray = terrainSurface.geometry.attributes.position.array;
    for (let i = 0; i < positionsArray.length; i += 3) {
      const x = positionsArray[i];
      const z = positionsArray[i + 1];

      // Check if lake area
      if (x < 10 && x > -10 && z < 15 && z > -15) {
        // Set Y under water
        positionsArray[i + 2] = 0.5;
      } else {
        // Generete Y with some noise
        positionsArray[i + 2] = Math.random() * 0.8 - 0.1;
      }
    }

    this.scene.add(terrainSurface);
  }

  loadTreeModels() {
    const loader = new FBXLoader();
    const promises = [];

    for (let i = 1; i <= this.numberOfTreeModels; i++) {
      const treeModel = loader.loadAsync(`/models/tree_${i}.fbx`);
      promises.push(treeModel);
    }

    return Promise.all(promises);
  }

  async genereteForest() {
    // Load trees models
    const treesModels = await this.loadTreeModels();

    // Tress lines generator
    const minX = this.terrainSize.startX;
    const maxX = this.terrainSize.startX + this.terrainSize.width;
    const minZ = this.terrainSize.startZ;
    const maxZ = this.terrainSize.startZ + this.terrainSize.height;

    let positionX = minX;
    let positionZ = minZ;

    const drawTreeModel = () => treesModels[Math.floor(Math.random() * this.numberOfTreeModels)];
    const drawColor = () => this.treesColors[Math.floor(Math.random() * this.treesColors.length)];

    while (positionX >= minX && positionX <= maxX) {
      // Add trees line on x axis
      while (positionZ >= minZ && positionZ <= maxZ) {
        // Check if is crossing with area without trees
        if (!this.isCrossingForestFreeArea(positionX, positionZ)) {
          // If false generete new tree
          const tree = drawTreeModel().clone();
          this.generateTree(tree, positionX, positionZ, drawColor());
        }

        positionZ += this.treesScatter;
      }

      // Restart positionZ
      positionZ = minZ;

      // Increase positionX
      positionX += this.treesScatter;
    }
  }

  isCrossingForestFreeArea(x, z) {
    let isCrossing = false;

    for (const areaName in this.forrestFreeTerrains) {
      const area = this.forrestFreeTerrains[areaName];
      isCrossing = x > area.minX && x < area.maxX && z > area.minZ && z < area.maxZ;
      if (isCrossing) break;
    }

    return isCrossing;
  }

  generateTree(tree, positionX, positionZ, color) {
    // Scale model
    tree.scale.multiplyScalar(Math.random() * 0.003 + 0.005);

    // Change trunk material and color
    tree.children[0].material[0] = new THREE.MeshPhongMaterial({ color: 0x30221c });

    // Change leavs material and color
    const material = new THREE.MeshPhongMaterial({ color: color });
    tree.children[0].material[1] = material;
    tree.children[0].material[2] = material;

    // Set tree position
    tree.position.x = positionX + Math.random() * this.treesScatter;
    tree.position.z = positionZ + Math.random() * this.treesScatter;

    // Rotate tree
    tree.rotation.y += Math.random() * Math.PI;

    // Add tree to scene
    this.scene.add(tree);
  }
}

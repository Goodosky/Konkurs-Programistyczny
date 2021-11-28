import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export class Terrain {
  constructor(scene, graphicQuality) {
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
    this.treesScatter = 1;
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

    // Generete terrain surface
    this.genereteTerrainSurface();

    // Generate forrest (only if graphic quality == 'normal')
    if (graphicQuality == "normal") this.genereteForest();
  }

  genereteTerrainSurface() {
    // Create terrain mesh
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
      if (x < 7 && x > -12 && z < 16 && z > -15) {
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
    // Helpers
    const drawTreeId = () => Math.floor(Math.random() * this.numberOfTreeModels);

    // Load trees models
    const treesModels = await this.loadTreeModels();

    // Make array with instance for everone tree model
    const { instancedMeshes, instancedMeshesCounter } = this.modelsToInsctaces(treesModels);

    // Create matrix
    const matrix = new THREE.Matrix4();

    // Tress lines generator
    const minX = this.terrainSize.startX;
    const maxX = this.terrainSize.startX + this.terrainSize.width;
    const minZ = this.terrainSize.startZ;
    const maxZ = this.terrainSize.startZ + this.terrainSize.height;

    let positionX = minX;
    let positionZ = minZ;

    while (positionX >= minX && positionX <= maxX) {
      // Add trees line on x axis
      while (positionZ >= minZ && positionZ <= maxZ) {
        // Check if is crossing with area without trees
        if (!this.isCrossingForestFreeArea(positionX, positionZ)) {
          // Draw tree instance index
          const treeId = drawTreeId();

          // Generete new tree
          this.updateMatrix(matrix, positionX, positionZ);
          instancedMeshes[treeId].setMatrixAt(instancedMeshesCounter[treeId], matrix);

          // Increment counter
          instancedMeshesCounter[treeId]++;
        }

        positionZ += this.treesScatter;
      }

      // Restart positionZ
      positionZ = minZ;

      // Increase positionX
      positionX += this.treesScatter;
    }

    console.log("instancedMeshesCounter:", instancedMeshesCounter);

    for (let i = 0; i < this.numberOfTreeModels; i++) {
      // Reduce number of instances of mesh
      instancedMeshes[i].count = instancedMeshesCounter[i];
      // Add mesh to scene
      this.scene.add(instancedMeshes[i]);
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

  modelsToInsctaces(treesModels) {
    const drawColor = () => this.treesColors[Math.floor(Math.random() * this.treesColors.length)];

    const instancedMeshes = [];
    const instancedMeshesCounter = [];

    for (let i = 0; i < this.numberOfTreeModels; i++) {
      const treeMesh = treesModels[i].children[0];
      treeMesh.material = [
        new THREE.MeshPhongMaterial({ color: 0x30221c }), // trunk
        new THREE.MeshPhongMaterial({ color: drawColor() }), // leavs
        new THREE.MeshPhongMaterial({ color: drawColor() }), // leavs (in some models)
      ];
      instancedMeshes.push(new THREE.InstancedMesh(treeMesh.geometry, treeMesh.material, 800));
      instancedMeshesCounter.push(0);
    }

    return { instancedMeshes, instancedMeshesCounter };
  }

  updateMatrix(matrix, positionX, positionZ) {
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    position.x = positionX + Math.random() * this.treesScatter;
    position.z = positionZ + Math.random() * this.treesScatter;

    rotation.z += Math.random() * Math.PI;
    rotation.x -= Math.PI / 2;

    quaternion.setFromEuler(rotation);

    scale.x = scale.y = scale.z = Math.random() * 0.5 + 0.6;

    matrix.compose(position, quaternion, scale);
  }
}

import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export class Boat {
  constructor() {
    this._boat = undefined;
    this._modelLoaded = false;
  }

  loadModel(scene) {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("/models/BoatWSail.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("/models/BoatWSail.obj", (boat) => {
        scene.add(boat);
        this._boat = boat;
        this._modelLoaded = true;
      });
    });
  }
}

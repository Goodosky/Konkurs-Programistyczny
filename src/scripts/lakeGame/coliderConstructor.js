import * as THREE from "three";

export class ColiderConstructor {
  getLakeColiders() {
    const coliders = [];

    // Colider 1
    const box1 = new THREE.Box3();
    box1.setFromCenterAndSize(new THREE.Vector3(0, 0, -15.5), new THREE.Vector3(30, 5, 1));
    coliders.push(box1);

    // Colider 2
    const box2 = new THREE.Box3();
    box2.setFromCenterAndSize(new THREE.Vector3(0, 0, 15.5), new THREE.Vector3(30, 5, 1));
    coliders.push(box2);

    // Colider 3
    const box3 = new THREE.Box3();
    box3.setFromCenterAndSize(new THREE.Vector3(-10.5, 0, 0), new THREE.Vector3(1, 5, 30));
    coliders.push(box3);

    // Colider 4
    const box4 = new THREE.Box3();
    box4.setFromCenterAndSize(new THREE.Vector3(10.5, 0, 0), new THREE.Vector3(1, 5, 30));
    coliders.push(box4);

    return coliders;
  }
}

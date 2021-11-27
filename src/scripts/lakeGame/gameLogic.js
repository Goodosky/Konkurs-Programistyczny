import * as THREE from "three";

export class GameLogic {
  constructor(dataForHUD) {
    this.data = dataForHUD;
    this.clock = new THREE.Clock();
  }

  nextLevel() {
    this.data.points += 1;
    this.data.remainingTime += 3;
  }

  updateTime() {
    const delta = this.clock.getDelta();

    if (this.data.timeToStart >= 0) {
      this.data.timeToStart -= delta;
    } else if (this.data.remainingTime < delta) {
      this.clock.stop;
      this.data.remainingTime = 0;
    } else this.data.remainingTime -= delta;
  }
}

export class GameLogic {
  constructor(dataForHUD) {
    this.data = dataForHUD;
  }

  nextLevel() {
    this.data.points += 1;
    this.data.remainingTime += 3;
  }

  updateTime(timeDelta) {
    // Skip if user hasn't clicked the start btn yet
    if (!this.data.gameStarted) return;

    // Update timers
    if (this.data.timeToStart >= 0) {
      this.data.timeToStart -= timeDelta;
    } else if (this.data.remainingTime > 0) {
      this.data.remainingTime -= timeDelta;
    }
  }
}

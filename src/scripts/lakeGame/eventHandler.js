export class EventHandler {
  constructor(boat) {
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp") {
        boat.moveBoat("foward");
      } else if (e.key == "ArrowDown") {
        boat.moveBoat("backword");
      } else if (e.key == "ArrowRight") {
        boat.rotateBoat("right");
      } else if (e.key == "ArrowLeft") {
        boat.rotateBoat("left");
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        boat.moveStop();
      } else if (e.key == "ArrowRight" || e.key == "ArrowLeft") {
        boat.rotationStop();
      }
    });
  }
}

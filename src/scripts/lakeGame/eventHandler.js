export class EventHandler {
  constructor(boat) {
    const isMovement = {
      foward: false,
      back: false,
      right: false,
      left: false,
    };

    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp") {
        boat.moveBoat("foward");
        isMovement.foward = true;
      } else if (e.key == "ArrowDown") {
        boat.moveBoat("back");
        isMovement.back = true;
      } else if (e.key == "ArrowRight" && !isMovement.right && !isMovement.left) {
        boat.rotateBoat("right");
        isMovement.right = true;
      } else if (e.key == "ArrowLeft" && !isMovement.right && !isMovement.left) {
        boat.rotateBoat("left");
        isMovement.left = true;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == "ArrowDown") {
        boat.moveStop();
        isMovement.foward = false;
        isMovement.back = false;
      } else if (e.key == "ArrowRight" && isMovement.right) {
        boat.rotationStop();
        isMovement.right = false;
      } else if (e.key == "ArrowLeft" && isMovement.left) {
        boat.rotationStop();
        isMovement.left = false;
      }
    });
  }
}

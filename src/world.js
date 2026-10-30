import { Camera2D } from "./camera.js";
import { Maze } from "./maze.js";
import { Player } from "./player.js";

const PLAYER_SPEED = 3;

const calculatePlayerFacing = ({ x, y }) => {
  if (Math.abs(x) > Math.abs(y)) {
    if (x > 0) return "east";
    return "west";
  }

  if (y < 0) return "north";

  return "south";
};

export class World {
  constructor() {
    this.reset();
  }

  reset() {
    this.maze = new Maze(50, 50);
    this.camera = new Camera2D(180);
    const start = this.maze.start;
    this.player = new Player(1, start.x + 0.5, start.y + 0.5);
  }

  update(dt, controller) {
    const leftStick = controller.getLeftStick();

    const { player } = this;
    if (leftStick.x !== 0 || leftStick.y !== 0) {
      player.facing = calculatePlayerFacing(leftStick);
    }
    const moved = this.maze.moveBox(
      player,
      leftStick.x * PLAYER_SPEED * dt,
      leftStick.y * PLAYER_SPEED * dt,
      player.getHitbox(),
    );
    player.x = moved.x;
    player.y = moved.y;
  }

  render() {
    this.camera.follow(this.player);
    this.maze.render(this.camera, [this.player]);
  }
}

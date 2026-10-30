import { Camera2D } from "./camera.js";
import { Maze } from "./maze.js";
import { Player } from "./player.js";

const PLAYER_SPEED = 3;

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

    this.player.x += leftStick.x * PLAYER_SPEED * dt;
    this.player.y += leftStick.y * PLAYER_SPEED * dt;
  }

  render() {
    this.maze.render(this.camera);
    this.camera.follow(this.player);
    this.player.render(this.camera);
  }
}

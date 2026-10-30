import { Camera2D } from "./camera.js";
import { Maze } from "./maze.js";
import { Player } from "./player.js";

export class World {
  constructor() {
    this.reset();
  }

  reset() {
    this.maze = new Maze(50, 50);
    this.camera = new Camera2D(10);
    const start = this.maze.start;
    this.player = new Player(1, start.x + 0.5, start.y + 0.5);
  }

  render() {
    this.maze.render(this.camera);
    this.camera.follow(this.player);
    this.player.render(this.camera);
  }
}

import { Camera2D } from "./camera.js";
import { Maze } from "./maze.js";
import { Player } from "./player.js";

export class World {
  constructor() {
    this.reset();
  }

  reset() {
    this.maze = new Maze(50, 50);
    this.camera = new Camera2D(25);
    this.player = new Player(1, 0, 0);
  }

  render() {
    this.maze.render(this.camera);
    this.player.render(this.camera);
    this.camera.follow(this.player);
  }
}

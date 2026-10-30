import { Camera2D } from "./camera.js";
import { Maze } from "./maze.js";
import { Monster } from "./monster.js";
import { Player } from "./player.js";

const PLAYER_SPEED = 3;
const DIVIDER_WIDTH = 4;
const DIVIDER_COLOR = Color.new(0, 0, 0, 128);

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
    const { width, height } = Screen.getMode();
    const halfWidth = Math.floor(width / 2);
    this.playerCamera = new Camera2D(180, {
      x: 0,
      y: 0,
      w: halfWidth,
      h: height,
    });
    this.monsterCamera = new Camera2D(130, {
      x: halfWidth,
      y: 0,
      w: width - halfWidth,
      h: height,
    });
    const start = this.maze.start;
    const monsterStart = this.maze.monsterStart;
    this.player = new Player(1, start.x + 0.5, start.y + 0.5);
    this.monster = new Monster(monsterStart.x + 0.5, monsterStart.y + 0.5);
  }

  handleInput(dt, controller, character) {
    const leftStick = controller.getLeftStick();

    if (leftStick.x !== 0 || leftStick.y !== 0) {
      character.facing = calculatePlayerFacing(leftStick);
    }
    const moved = this.maze.moveBox(
      character,
      leftStick.x * PLAYER_SPEED * dt,
      leftStick.y * PLAYER_SPEED * dt,
      character.getHitbox(),
    );
    character.x = moved.x;
    character.y = moved.y;
  }

  update(dt, playerController, monsterController) {
    const { player, monster } = this;
    this.handleInput(dt, playerController, player);
    this.handleInput(dt, monsterController, monster);
  }

  /** @returns {boolean} true once the player has walked out through the maze opening */
  hasReachedExit() {
    const { maze, player } = this;
    return (
      player.x < 0 ||
      player.y < 0 ||
      player.x >= maze.width ||
      player.y >= maze.height
    );
  }

  render() {
    this.playerCamera.follow(this.player);
    this.monsterCamera.follow(this.monster);
    for (const camera of [this.playerCamera, this.monsterCamera]) {
      camera.apply();
      this.maze.render(camera, [this.player, this.monster]);
    }
    this.monsterCamera.release();
    const { x, h } = this.monsterCamera.viewport;
    Draw.rect(x - DIVIDER_WIDTH / 2, 0, DIVIDER_WIDTH, h, DIVIDER_COLOR);
  }
}

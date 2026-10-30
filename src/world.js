import { Camera2D } from "./camera.js";
import { Maze } from "./maze.js";
import { Monster } from "./monster.js";
import { Player } from "./player.js";

const PLAYER_SPEED = 3;
const DIVIDER_WIDTH = 4;
const DIVIDER_COLOR = Color.new(0, 0, 0, 128);
const FLOOR_TEXTURE_SIZE = 48;

const FLOOR_BLEND = Screen.alphaEquation(
  Screen.SRC_RGB,
  Screen.DST_RGB,
  Screen.SRC_ALPHA,
  Screen.DST_RGB,
  0,
);

// GS alpha is 0..128, where 128 is fully opaque
const OPAQUE_ALPHA = 128;

TileMap.init();

/**
 * Builds a grid of floor tiles, one per cell, just large enough to cover a
 * camera viewport at any scroll position.
 * @param {Camera2D} camera
 */
const createFloor = ({ scale, viewport }) => {
  const cols = Math.ceil(viewport.w / scale) + 1;
  const rows = Math.ceil(viewport.h / scale) + 1;
  const sprites = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      sprites.push({
        x: col * scale,
        y: row * scale,
        zindex: 1,
        w: scale,
        h: scale,
        u1: 0,
        v1: 0,
        u2: FLOOR_TEXTURE_SIZE,
        v2: FLOOR_TEXTURE_SIZE,
        r: 255,
        g: 255,
        b: 255,
        a: OPAQUE_ALPHA,
      });
    }
  }
  const descriptor = new TileMap.Descriptor({
    textures: ["assets/flooring.png"],
    materials: [
      {
        texture_index: 0,
        blend_mode: FLOOR_BLEND,
        end_offset: sprites.length - 1,
      },
    ],
  });
  return new TileMap.Instance({
    descriptor,
    spriteBuffer: TileMap.SpriteBuffer.fromObjects(sprites),
  });
};

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
    this.playerFloor = createFloor(this.playerCamera);
    this.monsterFloor = createFloor(this.monsterCamera);
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

  /**
   * Scrolls a floor grid so its tiles stay aligned to the world cells.
   * @param {Camera2D} camera
   * @param {TileMap.Instance} floor
   */
  renderFloor(camera, floor) {
    const { scale, viewport } = camera;
    const relX = camera.toScreenX(0) - viewport.x;
    const relY = camera.toScreenY(0) - viewport.y;
    floor.render(
      viewport.x + relX - Math.ceil(relX / scale) * scale,
      viewport.y + relY - Math.ceil(relY / scale) * scale,
    );
  }

  render() {
    this.playerCamera.follow(this.player);
    this.monsterCamera.follow(this.monster);
    TileMap.begin();
    const cameras = [
      [this.playerCamera, this.playerFloor],
      [this.monsterCamera, this.monsterFloor],
    ];
    for (const [camera, floor] of cameras) {
      camera.apply();
      this.renderFloor(camera, floor);
      this.maze.render(camera, [this.player, this.monster]);
    }
    this.monsterCamera.release();
    const { x, h } = this.monsterCamera.viewport;
    Draw.rect(x - DIVIDER_WIDTH / 2, 0, DIVIDER_WIDTH, h, DIVIDER_COLOR);
  }
}

import { Camera2D } from "./camera.js";
import { Maze } from "./maze.js";
import { Monster } from "./monster.js";
import { Player } from "./player.js";

const SPRINT_MULTIPLIER = 1.75;
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
        r: 128,
        g: 128,
        b: 128,
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

// Arrow on the monster's half, always pointing at the player, ARROW_DISTANCE px from the monster.
const ARROW_DISTANCE = 60;
const ARROW_LENGTH = 24;
const ARROW_WIDTH = 16;
const ARROW_COLOR = Color.new(255, 210, 0, 128);
// Break wall looks this far ahead, in cells, for a wall tile to remove.
const BREAK_REACH = 1;
const FACING_DIRECTIONS = {
  east: { x: 1, y: 0 },
  west: { x: -1, y: 0 },
  north: { x: 0, y: -1 },
  south: { x: 0, y: 1 },
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

  // X and O use the character's abilities against the opponent; the stick moves it.
  // Stunned characters can do neither.
  handleInput(dt, controller, character, opponent) {
    character.update(dt);
    if (character.hasEffect("stunned")) return;

    const pad = controller.pad;
    if (pad.justPressed(Pads.CROSS))
      character.abilities.cross.use(character, opponent, this);
    if (pad.justPressed(Pads.CIRCLE))
      character.abilities.circle.use(character, opponent, this);

    let { x, y } = controller.getLeftStick();
    if (character.hasEffect("confused")) {
      x = -x;
      y = -y;
    }
    if (x !== 0 || y !== 0) character.facing = calculatePlayerFacing({ x, y });

    const sprint = character.hasEffect("sprinting") ? SPRINT_MULTIPLIER : 1;
    const step = character.speed * sprint * dt;
    const moved = this.maze.moveBox(
      character,
      x * step,
      y * step,
      character.getHitbox(),
    );
    character.x = moved.x;
    character.y = moved.y;
  }

  update(dt, playerController, monsterController) {
    const { player, monster } = this;
    this.handleInput(dt, playerController, player, monster);
    this.handleInput(dt, monsterController, monster, player);
    if (this.isMonsterHittingPlayer()) this.player.health -= 1;
  }

  /** @returns {boolean} true while the monster's hitbox overlaps the player's */
  isPlayerDead() {
    return this.player.health === 0;
  }

  isMonsterHittingPlayer() {
    const { player, monster } = this;
    const a = player.getHitbox();
    const b = monster.getHitbox();
    return (
      Math.abs(player.x - monster.x) < (a.w + b.w) / 2 &&
      Math.abs(player.y - monster.y) < (a.h + b.h) / 2
    );
  }

  /**
   * Break wall: removes the first wall tile within BREAK_REACH cells in the
   * direction the character faces. Walls are thin lines through the middle of
   * their tile, so this also finds the wall a character is pressed against.
   * @returns {boolean} true if a wall was removed
   */
  breakWallInFront(character) {
    const direction = FACING_DIRECTIONS[character.facing];
    for (const distance of [0.5, BREAK_REACH]) {
      const gx = Math.floor(character.x + direction.x * distance);
      const gy = Math.floor(character.y + direction.y * distance);
      if (this.maze.breakWall(gx, gy)) return true;
    }
    return false;
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
      this.player.renderOverlay(camera);
      this.monster.renderOverlay(camera);
    }
    // Still clipped to the monster's half from the loop above.
    this.renderArrow();
    this.monsterCamera.release();
    const { x, h } = this.monsterCamera.viewport;
    Draw.rect(x - DIVIDER_WIDTH / 2, 0, DIVIDER_WIDTH, h, DIVIDER_COLOR);
  }

  // A triangle circling the monster, its tip pointing at the player.
  renderArrow() {
    const { player, monster, monsterCamera } = this;
    const angle = Math.atan2(player.y - monster.y, player.x - monster.x);
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    // The camera follows the monster, so it's at the center of its viewport.
    const centerX = monsterCamera.viewport.x + monsterCamera.halfW;
    const centerY = monsterCamera.viewport.y + monsterCamera.halfH;

    const baseX = centerX + dirX * ARROW_DISTANCE;
    const baseY = centerY + dirY * ARROW_DISTANCE;
    const tipX = baseX + dirX * ARROW_LENGTH;
    const tipY = baseY + dirY * ARROW_LENGTH;
    // Perpendicular to the direction, for the two back corners.
    const sideX = -dirY * (ARROW_WIDTH / 2);
    const sideY = dirX * (ARROW_WIDTH / 2);
    Draw.triangle(
      tipX,
      tipY,
      baseX + sideX,
      baseY + sideY,
      baseX - sideX,
      baseY - sideY,
      ARROW_COLOR,
    );
  }
}

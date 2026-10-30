const WALL_GAP = 0.001;
const WALL_THICKNESS = 0.1;
const MAX_STEP = 0.05;
const MAX_SUBSTEPS = 200;
const MAX_PUSH_OUT_ITERATIONS = 4;
const WALL_FACE_HEIGHT = 1;
const SOUTH_WALL_FACE_HEIGHT = WALL_FACE_HEIGHT / 2;
const MIN_MONSTER_START_DISTANCE = 20;
const MAX_MONSTER_START_DISTANCE = Infinity;

const WALL_TILE_SIZE = 128;
const wallTile = new Image("assets/wall_tile.png");

/**
 * Draws a slice of the wall tile stretched to a screen box. The tile covers one
 * cell, so slices of neighbouring walls line up.
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} fx fraction of the tile width to draw, from the left
 * @param {number} fy fraction of the tile height to draw, from the bottom
 */
const drawWallTile = (x, y, w, h, fx = 1, fy = 1) => {
  wallTile.startx = 0;
  wallTile.starty = WALL_TILE_SIZE * (1 - fy);
  wallTile.endx = WALL_TILE_SIZE * fx;
  wallTile.endy = WALL_TILE_SIZE;
  wallTile.width = w;
  wallTile.height = h;
  wallTile.draw(x, y);
};

/**
 * Mixed float32/double comparisons gave wrong results in AthenaEnv, so wall
 * rects and the tested box are both forced to float32.
 */
const rect = (x0, y0, x1, y1) => ({
  x0: Math.fround(x0),
  y0: Math.fround(y0),
  x1: Math.fround(x1),
  y1: Math.fround(y1),
});

export class Maze {
  /**
   * @param {number} width cells per row, rounded up to odd
   * @param {number} height cells per column, rounded up to odd
   */
  constructor(width, height) {
    this.width = width % 2 === 0 ? width + 1 : width;
    this.height = height % 2 === 0 ? height + 1 : height;
    /** @type {number[][]} 0 = no wall, 1 = wall */
    this.grid = this.generate();
    /** @type {{x: number, y: number}} */
    this.start = this.pickStart();
    /** @type {{x: number, y: number}} random open cell at least MIN_MONSTER_START_DISTANCE steps from start */
    this.monsterStart = this.pickMonsterStart();
    /** @type {{x: number, y: number}} open cell next to the border, farthest from start */
    this.exit = this.farthestFrom(this.start, (x, y) =>
      this.touchesBorder(x, y),
    );
    /** @type {{x: number, y: number}} border cell opened so the player can walk out */
    this.opening = this.openExit();
    this.rects = this.buildWallRects();
  }

  /** @returns {boolean} true if the cell is adjacent to the outer wall */
  touchesBorder(x, y) {
    return x === 1 || y === 1 || x === this.width - 2 || y === this.height - 2;
  }

  /**
   * Removes the border wall next to the exit cell.
   * @returns {{x: number, y: number}} the removed wall cell
   */
  openExit() {
    const { x, y } = this.exit;
    let opening;
    if (x === 1) opening = { x: 0, y };
    else if (y === 1) opening = { x, y: 0 };
    else if (x === this.width - 2) opening = { x: this.width - 1, y };
    else opening = { x, y: this.height - 1 };
    this.grid[opening.y][opening.x] = 0;
    return opening;
  }

  /** @returns {{x: number, y: number}} random cell, always on odd coords */
  pickStart() {
    const cellsX = (this.width - 1) / 2;
    const cellsY = (this.height - 1) / 2;
    return {
      x: 1 + 2 * Math.floor(Math.random() * cellsX),
      y: 1 + 2 * Math.floor(Math.random() * cellsY),
    };
  }

  /** @returns {{x: number, y: number}} falls back to the farthest cell if the maze is too small */
  pickMonsterStart() {
    const dist = this.distancesFrom(this.start);
    const candidates = [];
    for (let y = 1; y < this.height; y += 2) {
      for (let x = 1; x < this.width; x += 2) {
        const d = dist[y][x];
        if (d >= MIN_MONSTER_START_DISTANCE && d <= MAX_MONSTER_START_DISTANCE)
          candidates.push({ x, y });
      }
    }
    if (candidates.length === 0) return this.farthestFrom(this.start);
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  /**
   * @param {{x: number, y: number}} from
   * @returns {number[][]} walking steps from `from` by [y][x], -1 if unreachable
   */
  distancesFrom(from) {
    const dist = Array.from({ length: this.height }, () =>
      new Array(this.width).fill(-1),
    );
    dist[from.y][from.x] = 0;
    const queue = [[from.x, from.y]];
    for (let i = 0; i < queue.length; i++) {
      const [x, y] = queue[i];
      for (const [dx, dy] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        // isOpen checks bounds: the exit opening sits on the border.
        if (!this.isOpen(nx, ny) || dist[ny][nx] !== -1) continue;
        dist[ny][nx] = dist[y][x] + 1;
        queue.push([nx, ny]);
      }
    }
    return dist;
  }

  /** @returns {boolean} true for an open grid cell inside the maze */
  isOpen(gx, gy) {
    return gx >= 0 && gy >= 0 && gx < this.width && gy < this.height && this.grid[gy][gx] === 0;
  }

  /**
   * Removes one wall tile. The outer wall can't be broken, so the exit stays the only way out.
   * Removing walls only adds connections, so the maze stays solvable.
   * @returns {boolean} true if a wall was removed
   */
  breakWall(gx, gy) {
    const onBorder = gx <= 0 || gy <= 0 || gx >= this.width - 1 || gy >= this.height - 1;
    if (onBorder || this.grid[gy][gx] !== 1) return false;
    this.grid[gy][gx] = 0;
    // Collision reads the prebuilt rects (render reads the grid), and neighbours' connectors change too.
    this.rects = this.buildWallRects();
    return true;
  }

  /**
   * Wall cells are nodes at their cell center. Each node is a thin square, and
   * touching wall neighbours (right, down) are joined by a thin connector.
   * Built once per maze since collision and render both read it every frame.
   * @returns {{x0: number, y0: number, x1: number, y1: number}[][][]} rects by [gy][gx]
   */
  buildWallRects() {
    const h = WALL_THICKNESS / 2;
    const rows = [];
    for (let gy = 0; gy < this.height; gy++) {
      const row = [];
      for (let gx = 0; gx < this.width; gx++) {
        const rects = [];
        if (this.grid[gy][gx] === 1) {
          const cx = gx + 0.5;
          const cy = gy + 0.5;
          rects.push(rect(cx - h, cy - h, cx + h, cy + h));
          if (gx + 1 < this.width && this.grid[gy][gx + 1] === 1) {
            rects.push(rect(cx + h, cy - h, cx + 1 - h, cy + h));
          }
          if (gy + 1 < this.height && this.grid[gy + 1][gx] === 1) {
            rects.push(rect(cx - h, cy + h, cx + h, cy + 1 - h));
          }
        }
        row.push(rects);
      }
      rows.push(row);
    }
    return rows;
  }

  /**
   * @param {number} gx
   * @param {number} gy
   * @returns {{x0: number, y0: number, x1: number, y1: number}[]}
   */
  wallRects(gx, gy) {
    if (gx < 0 || gy < 0 || gx >= this.width || gy >= this.height) return [];
    return this.rects[gy][gx];
  }

  /**
   * @param {number} x box center
   * @param {number} y box center
   * @param {{w: number, h: number}} box edge lengths in cells
   * @returns {{x0: number, y0: number, x1: number, y1: number}[]} wall rects overlapping the box
   */
  hitRects(x, y, box) {
    const halfW = box.w / 2;
    const halfH = box.h / 2;
    const minGx = Math.floor(x - halfW) - 1;
    const maxGx = Math.floor(x + halfW) + 1;
    const minGy = Math.floor(y - halfH) - 1;
    const maxGy = Math.floor(y + halfH) + 1;
    const left = Math.fround(x - halfW);
    const right = Math.fround(x + halfW);
    const top = Math.fround(y - halfH);
    const bottom = Math.fround(y + halfH);
    const hits = [];
    for (let gy = minGy; gy <= maxGy; gy++) {
      for (let gx = minGx; gx <= maxGx; gx++) {
        const rects = this.wallRects(gx, gy);
        for (let i = 0; i < rects.length; i++) {
          const r = rects[i];
          if (r.x0 < right && r.x1 > left && r.y0 < bottom && r.y1 > top) {
            hits.push(r);
          }
        }
      }
    }
    return hits;
  }

  /**
   * Walls are thin, so large steps are split to keep the box from tunneling through.
   * @param {{x: number, y: number}} pos box center
   * @param {number} dx
   * @param {number} dy
   * @param {{w: number, h: number}} box edge lengths in cells
   * @returns {{x: number, y: number}}
   */
  moveBox(pos, dx, dy, box) {
    const steps = Math.min(
      MAX_SUBSTEPS,
      Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / MAX_STEP)),
    );
    let current = this.pushOut(pos, box);
    for (let i = 0; i < steps; i++) {
      current = this.stepBox(current, dx / steps, dy / steps, box);
    }
    return current;
  }

  /**
   * A character can end up inside a wall when its hitbox grows, e.g. after
   * turning. Moves the box out along the axis with the least overlap.
   * @param {{x: number, y: number}} pos box center
   * @param {{w: number, h: number}} box edge lengths in cells
   * @returns {{x: number, y: number}}
   */
  pushOut(pos, box) {
    const halfW = box.w / 2;
    const halfH = box.h / 2;
    let { x, y } = pos;
    for (let i = 0; i < MAX_PUSH_OUT_ITERATIONS; i++) {
      const hits = this.hitRects(x, y, box);
      if (hits.length === 0) break;
      const r = hits[0];
      const moves = [
        { dx: r.x0 - halfW - WALL_GAP - x, dy: 0 },
        { dx: r.x1 + halfW + WALL_GAP - x, dy: 0 },
        { dx: 0, dy: r.y0 - halfH - WALL_GAP - y },
        { dx: 0, dy: r.y1 + halfH + WALL_GAP - y },
      ];
      const least = moves.reduce((a, b) =>
        Math.abs(a.dx) + Math.abs(a.dy) <= Math.abs(b.dx) + Math.abs(b.dy)
          ? a
          : b,
      );
      x += least.dx;
      y += least.dy;
    }
    return { x, y };
  }

  /**
   * Moves the box per axis so it slides along walls and stops flush against them.
   * @param {{x: number, y: number}} pos box center
   * @param {number} dx
   * @param {number} dy
   * @param {{w: number, h: number}} box edge lengths in cells
   * @returns {{x: number, y: number}}
   */
  stepBox(pos, dx, dy, box) {
    const halfW = box.w / 2;
    const halfH = box.h / 2;
    let { x, y } = pos;

    const nextX = x + dx;
    const hitsX = this.hitRects(nextX, y, box);
    if (hitsX.length === 0) {
      x = nextX;
    } else if (dx > 0) {
      x =
        Math.min.apply(
          null,
          hitsX.map((r) => r.x0),
        ) -
        halfW -
        WALL_GAP;
    } else if (dx < 0) {
      x =
        Math.max.apply(
          null,
          hitsX.map((r) => r.x1),
        ) +
        halfW +
        WALL_GAP;
    }

    const nextY = y + dy;
    const hitsY = this.hitRects(x, nextY, box);
    if (hitsY.length === 0) {
      y = nextY;
    } else if (dy > 0) {
      y =
        Math.min.apply(
          null,
          hitsY.map((r) => r.y0),
        ) -
        halfH -
        WALL_GAP;
    } else if (dy < 0) {
      y =
        Math.max.apply(
          null,
          hitsY.map((r) => r.y1),
        ) +
        halfH +
        WALL_GAP;
    }

    return { x, y };
  }

  /**
   * @param {{x: number, y: number}} from
   * @param {(x: number, y: number) => boolean} accept which cells may be picked
   * @returns {{x: number, y: number}} accepted open cell with the longest walking path from `from`
   */
  farthestFrom(from, accept = () => true) {
    const dist = this.distancesFrom(from);
    let farthest = from;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (dist[y][x] > dist[farthest.y][farthest.x] && accept(x, y)) {
          farthest = { x, y };
        }
      }
    }
    return farthest;
  }

  /** @returns {number[][]} */
  generate() {
    const grid = Array.from({ length: this.height }, () =>
      new Array(this.width).fill(1),
    );

    const directions = [
      [0, -2],
      [2, 0],
      [0, 2],
      [-2, 0],
    ];

    grid[1][1] = 0;
    const stack = [[1, 1]];

    while (stack.length > 0) {
      const [x, y] = stack[stack.length - 1];

      const options = directions.filter(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return (
          nx > 0 &&
          ny > 0 &&
          nx < this.width - 1 &&
          ny < this.height - 1 &&
          grid[ny][nx] === 1
        );
      });

      if (options.length === 0) {
        stack.pop();
        continue;
      }

      const [dx, dy] = options[Math.floor(Math.random() * options.length)];
      grid[y + dy / 2][x + dx / 2] = 0;
      grid[y + dy][x + dx] = 0;
      stack.push([x + dx, y + dy]);
    }

    return grid;
  }

  /**
   * Walls are drawn row by row, and entities are drawn between rows by their bottom edge,
   * so anything further down the screen ends up on top.
   * @param {Camera2D} camera
   * @param {{bottom: number, render: (camera: Camera2D) => void}[]} entities
   */
  render(camera, entities = []) {
    const pending = entities
      .map((entity) => ({ entity, bottom: Math.fround(entity.bottom) }))
      .sort((a, b) => a.bottom - b.bottom);
    let next = 0;
    const h = WALL_THICKNESS / 2;
    const cullingOffset = 90;

    const spanX = (camera.halfW + cullingOffset) / camera.scale;
    const spanY = (camera.halfW + cullingOffset) / camera.scale;
    const minX = Math.max(0, Math.floor(camera.x - spanX));
    const maxX = Math.min(this.width - 1, Math.ceil(camera.x + spanX));
    const minY = Math.max(0, Math.floor(camera.y - spanY));
    const maxY = Math.min(
      this.height - 1,
      Math.ceil(camera.y + spanY + WALL_FACE_HEIGHT),
    );

    const px = (cells) => Math.max(1, Math.round(cells * camera.scale));

    for (let y = minY; y <= maxY; y++) {
      const rowBottom = Math.fround(y + 0.5 + h);
      while (next < pending.length && pending[next].bottom < rowBottom) {
        pending[next++].entity.render(camera);
      }
      for (let x = minX; x <= maxX; x++) {
        if (this.grid[y][x] !== 1) continue;

        const cx = x + 0.5;
        const cy = y + 0.5;
        const hasRight = x + 1 < this.width && this.grid[y][x + 1] === 1;
        const hasLeft = x > 0 && this.grid[y][x - 1] === 1;
        const hasDown = y + 1 < this.height && this.grid[y + 1][x] === 1;

        if (hasRight || hasLeft) {
          const span = hasRight ? 1 : WALL_THICKNESS;
          const isSouth = Math.fround(cy) > Math.fround(camera.y);
          const faceHeight = isSouth
            ? SOUTH_WALL_FACE_HEIGHT
            : WALL_FACE_HEIGHT;
          drawWallTile(
            camera.toScreenX(cx - h),
            camera.toScreenY(cy + h - faceHeight),
            px(span),
            px(faceHeight),
            span,
            faceHeight / WALL_FACE_HEIGHT,
          );
        } else {
          drawWallTile(
            camera.toScreenX(cx - h),
            camera.toScreenY(cy - h),
            px(WALL_THICKNESS),
            px(WALL_THICKNESS),
            WALL_THICKNESS,
            WALL_THICKNESS,
          );
        }

        if (hasDown) {
          drawWallTile(
            camera.toScreenX(cx - h),
            camera.toScreenY(cy + h),
            px(WALL_THICKNESS),
            px(1 - WALL_THICKNESS),
            WALL_THICKNESS,
            1 - WALL_THICKNESS,
          );
        }
      }
    }

    while (next < pending.length) {
      pending[next++].entity.render(camera);
    }
  }
}

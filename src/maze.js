const WALL_GAP = 0.001;
const WALL_THICKNESS = 0.1;
const MAX_STEP = 0.05;
const MAX_SUBSTEPS = 200;
const WALL_FACE_HEIGHT = 1;
const SOUTH_WALL_FACE_HEIGHT = WALL_FACE_HEIGHT / 2;

const horizontalWall = new Image("assets/wall_horizontal.png");
const verticalWall = new Image("assets/wall_vertical.png");
const SPRITE_SIZE = new Map([
  [horizontalWall, { w: 135, h: 135 }],
  [verticalWall, { w: 20, h: 135 }],
]);

/**
 * Draws a sprite stretched to a screen box.
 * @param {Image} image
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} fx fraction of the sprite width to draw, from the left
 * @param {number} fy fraction of the sprite height to draw, from the bottom
 */
const drawSprite = (image, x, y, w, h, fx = 1, fy = 1) => {
  const size = SPRITE_SIZE.get(image);
  image.startx = 0;
  image.starty = size.h * (1 - fy);
  image.endx = size.w * fx;
  image.endy = size.h;
  image.width = w;
  image.height = h;
  image.draw(x, y);
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
    this.rects = this.buildWallRects();
    /** @type {{x: number, y: number}} */
    this.start = this.pickStart();
    /** @type {{x: number, y: number}} */
    this.exit = this.farthestFrom(this.start);
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
   * @param {number} size box edge length in cells
   * @returns {{x0: number, y0: number, x1: number, y1: number}[]} wall rects overlapping the box
   */
  hitRects(x, y, size) {
    const half = size / 2;
    const hits = [];
    const minGx = Math.floor(x - half) - 1;
    const maxGx = Math.floor(x + half) + 1;
    const minGy = Math.floor(y - half) - 1;
    const maxGy = Math.floor(y + half) + 1;
    const left = Math.fround(x - half);
    const right = Math.fround(x + half);
    const top = Math.fround(y - half);
    const bottom = Math.fround(y + half);
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
   * @param {number} size box edge length in cells
   * @returns {{x: number, y: number}}
   */
  moveBox(pos, dx, dy, size) {
    const steps = Math.min(
      MAX_SUBSTEPS,
      Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / MAX_STEP)),
    );
    let current = pos;
    for (let i = 0; i < steps; i++) {
      current = this.stepBox(current, dx / steps, dy / steps, size);
    }
    return current;
  }

  /**
   * Moves the box per axis so it slides along walls and stops flush against them.
   * @param {{x: number, y: number}} pos box center
   * @param {number} dx
   * @param {number} dy
   * @param {number} size box edge length in cells
   * @returns {{x: number, y: number}}
   */
  stepBox(pos, dx, dy, size) {
    const half = size / 2;
    let { x, y } = pos;

    const nextX = x + dx;
    const hitsX = this.hitRects(nextX, y, size);
    if (hitsX.length === 0) {
      x = nextX;
    } else if (dx > 0) {
      x =
        Math.min.apply(
          null,
          hitsX.map((r) => r.x0),
        ) -
        half -
        WALL_GAP;
    } else if (dx < 0) {
      x =
        Math.max.apply(
          null,
          hitsX.map((r) => r.x1),
        ) +
        half +
        WALL_GAP;
    }

    const nextY = y + dy;
    const hitsY = this.hitRects(x, nextY, size);
    if (hitsY.length === 0) {
      y = nextY;
    } else if (dy > 0) {
      y =
        Math.min.apply(
          null,
          hitsY.map((r) => r.y0),
        ) -
        half -
        WALL_GAP;
    } else if (dy < 0) {
      y =
        Math.max.apply(
          null,
          hitsY.map((r) => r.y1),
        ) +
        half +
        WALL_GAP;
    }

    return { x, y };
  }

  /**
   * @param {{x: number, y: number}} from
   * @returns {{x: number, y: number}} open cell with the longest walking path from `from`
   */
  farthestFrom(from) {
    const dist = Array.from({ length: this.height }, () =>
      new Array(this.width).fill(-1),
    );
    dist[from.y][from.x] = 0;
    const queue = [[from.x, from.y]];
    let farthest = from;

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
        if (this.grid[ny][nx] === 1 || dist[ny][nx] !== -1) continue;
        dist[ny][nx] = dist[y][x] + 1;
        queue.push([nx, ny]);
        if (dist[ny][nx] > dist[farthest.y][farthest.x]) {
          farthest = { x: nx, y: ny };
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
   * Walls are drawn row by row, and entities are drawn between rows by their y,
   * so anything further down the screen ends up on top.
   * @param {Camera2D} camera
   * @param {{y: number, render: (camera: Camera2D) => void}[]} entities
   */
  render(camera, entities = []) {
    const pending = entities.slice().sort((a, b) => a.y - b.y);
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
      while (next < pending.length && pending[next].y < y + 0.5 + h) {
        pending[next++].render(camera);
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
          const isSouth = cy > camera.y;
          const faceHeight = isSouth
            ? SOUTH_WALL_FACE_HEIGHT
            : WALL_FACE_HEIGHT;
          drawSprite(
            horizontalWall,
            camera.toScreenX(cx - h),
            camera.toScreenY(cy + h - faceHeight),
            px(span),
            px(faceHeight),
            span,
            faceHeight / WALL_FACE_HEIGHT,
          );
        } else {
          drawSprite(
            verticalWall,
            camera.toScreenX(cx - h),
            camera.toScreenY(cy - h),
            px(WALL_THICKNESS),
            px(WALL_THICKNESS),
          );
        }

        if (hasDown) {
          drawSprite(
            verticalWall,
            camera.toScreenX(cx - h),
            camera.toScreenY(cy + h),
            px(WALL_THICKNESS),
            px(1 - WALL_THICKNESS),
          );
        }
      }
    }

    while (next < pending.length) {
      pending[next++].render(camera);
    }
  }
}

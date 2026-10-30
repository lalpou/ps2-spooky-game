const WALL_GAP = 0.001;
const WALL_THICKNESS = 0.1;
const MAX_STEP = 0.05;
const MAX_SUBSTEPS = 200;

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

  render(camera) {
    const wallColor = Color.new(255, 0, 0, 128);
    const cullingOffset = 50;

    const spanX = (camera.halfW + cullingOffset) / camera.scale;
    const spanY = (camera.halfW + cullingOffset) / camera.scale;
    const minX = Math.max(0, Math.floor(camera.x - spanX));
    const maxX = Math.min(this.width - 1, Math.ceil(camera.x + spanX));
    const minY = Math.max(0, Math.floor(camera.y - spanY));
    const maxY = Math.min(this.height - 1, Math.ceil(camera.y + spanY));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const rects = this.wallRects(x, y);
        for (let i = 0; i < rects.length; i++) {
          const r = rects[i];
          Draw.rect(
            camera.toScreenX(r.x0),
            camera.toScreenY(r.y0),
            Math.max(1, Math.round((r.x1 - r.x0) * camera.scale)),
            Math.max(1, Math.round((r.y1 - r.y0) * camera.scale)),
            wallColor,
          );
        }
      }
    }
  }
}

const WALL_GAP = 0.001;

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
   * @param {number} x box center
   * @param {number} y box center
   * @param {number} size box edge length in cells
   * @returns {boolean} true if any corner of the box is inside a wall
   */
  isBoxInWall(x, y, size) {
    const half = size / 2;
    return (
      this.isInWall(x - half, y - half) ||
      this.isInWall(x + half, y - half) ||
      this.isInWall(x - half, y + half) ||
      this.isInWall(x + half, y + half)
    );
  }

  /**
   * Moves the box per axis so it slides along walls and stops flush against them.
   * @param {{x: number, y: number}} pos box center
   * @param {number} dx
   * @param {number} dy
   * @param {number} size box edge length in cells
   * @returns {{x: number, y: number}}
   */
  moveBox(pos, dx, dy, size) {
    const half = size / 2;
    let { x, y } = pos;

    const nextX = x + dx;
    if (!this.isBoxInWall(nextX, y, size)) {
      x = nextX;
    } else if (dx > 0) {
      x = Math.floor(nextX + half) - half - WALL_GAP;
    } else if (dx < 0) {
      x = Math.floor(nextX - half) + 1 + half + WALL_GAP;
    }

    const nextY = y + dy;
    if (!this.isBoxInWall(x, nextY, size)) {
      y = nextY;
    } else if (dy > 0) {
      y = Math.floor(nextY + half) - half - WALL_GAP;
    } else if (dy < 0) {
      y = Math.floor(nextY - half) + 1 + half + WALL_GAP;
    }

    return { x, y };
  }

  isInWall(x, y) {
    return this.grid[Math.floor(y)][Math.floor(x)] === 1;
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

    const spanX = camera.halfW / camera.scale;
    const spanY = camera.halfH / camera.scale;
    const minX = Math.max(0, Math.floor(camera.x - spanX));
    const maxX = Math.min(this.width - 1, Math.ceil(camera.x + spanX));
    const minY = Math.max(0, Math.floor(camera.y - spanY));
    const maxY = Math.min(this.height - 1, Math.ceil(camera.y + spanY));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (this.grid[y][x] === 1) {
          Draw.rect(
            camera.toScreenX(x),
            camera.toScreenY(y),
            camera.scale,
            camera.scale,
            wallColor,
          );
        }
      }
    }
  }
}

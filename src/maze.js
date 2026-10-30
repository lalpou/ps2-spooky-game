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

  render() {
    const size = 10;
    const wallColor = Color.new(255, 0, 0, 128);

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] === 1) {
          Draw.rect(x * size, y * size, size, size, wallColor);
        }
      }
    }
  }
}

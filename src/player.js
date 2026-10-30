const color = Color.new(0, 255, 0, 128);

export class Player {
  constructor(health, x, y) {
    this.health = health;
    /** @type {number} edge length in cells, centered on x/y */
    this.size = 0.1;
    this.x = x;
    this.y = y;
  }

  render(camera) {
    Draw.rect(
      camera.toScreenX(this.x - this.size / 2),
      camera.toScreenY(this.y - this.size / 2),
      this.size * camera.scale,
      this.size * camera.scale,
      color,
    );
  }
}

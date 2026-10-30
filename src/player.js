const size = 4;
const color = Color.new(0, 255, 0, 128);

export class Player {
  constructor(health, x, y) {
    this.health = health;
    this.x = x;
    this.y = y;
  }

  render(camera) {
    Draw.rect(
      camera.toScreenX(this.x * size),
      camera.toScreenY(this.y * size),
      camera.scale,
      camera.scale,
      color,
    );
  }
}

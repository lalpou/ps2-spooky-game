export class Character {
  constructor(sprites, x, y, hitboxes, spriteSize) {
    /** @type {Record<string, {w: number, h: number}>} hitbox edge lengths in cells per facing, centered on x/y */
    this.hitboxes = hitboxes;
    /** @type {number} sprite edge length in cells, feet aligned with the hitbox bottom */
    this.spriteSize = spriteSize;
    this.x = x;
    this.y = y;
    this.facing = "south";
    this.sprites = sprites;
  }

  getHitbox() {
    return this.hitboxes[this.facing];
  }

  /** @returns {number} y of the hitbox bottom edge, used for draw order */
  get bottom() {
    return this.y + this.getHitbox().h / 2;
  }

  render(camera) {
    const sprite = this.sprites[this.facing];
    const edge = this.spriteSize * camera.scale;
    sprite.width = edge;
    sprite.height = edge;
    sprite.draw(
      camera.toScreenX(this.x - this.spriteSize / 2),
      camera.toScreenY(this.bottom - this.spriteSize),
    );
  }
}

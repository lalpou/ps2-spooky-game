import { Label } from "./ui/label.js";

// Stunned: the sprite shakes sideways by up to SHAKE_PIXELS, driven by the stun's time left.
const SHAKE_PIXELS = 4;
const SHAKE_SPEED = 50;
// Confused (inverted controls): a red "!" above the head.
const confusedMark = new Label("!", {
  color: Color.new(255, 0, 0, 128),
  scale: 2,
});
const MARK_GAP = 4;

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
    /** @type {number} cells per second at full stick; subclasses can override */
    this.speed = 3;
    /** @type {{cross: import("./abilities.js").Ability, circle: import("./abilities.js").Ability}} set by subclasses */
    this.abilities = null;
    /** @type {Record<string, number>} effect name -> seconds left, e.g. { stunned: 3.2 } */
    this.effects = {};
  }

  addEffect(name, seconds) {
    this.effects[name] = seconds;
  }

  hasEffect(name) {
    return (this.effects[name] || 0) > 0;
  }

  // Counts down effects and ability cooldowns. Call once per frame.
  update(dt) {
    for (const name of Object.keys(this.effects)) {
      this.effects[name] = Math.max(0, this.effects[name] - dt);
    }
    this.abilities.cross.update(dt);
    this.abilities.circle.update(dt);
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
    let x = camera.toScreenX(this.x - this.spriteSize / 2);
    if (this.hasEffect("stunned")) {
      x += Math.round(
        Math.sin(this.effects.stunned * SHAKE_SPEED) * SHAKE_PIXELS,
      );
    }
    sprite.draw(x, camera.toScreenY(this.bottom - this.spriteSize));
  }

  // Effect markers, drawn after the maze so walls in front never cover them.
  renderOverlay(camera) {
    if (!this.hasEffect("confused")) return;
    const size = confusedMark.size;
    const top = camera.toScreenY(this.bottom - this.spriteSize);
    confusedMark.render(
      camera.toScreenX(this.x) - size.width / 2,
      top - size.height - MARK_GAP,
    );
  }
}

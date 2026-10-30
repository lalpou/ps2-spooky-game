import { Element } from "./element.js";

export class Picture extends Element {
  static TOP_LEFT = { x: 0, y: 0 };
  static CENTER = { x: 0.5, y: 0.5 };

  constructor(path, scale = 1, anchor = Picture.TOP_LEFT) {
    super();
    this.image = new Image(path);
    this.image.width *= scale;
    this.image.height *= scale;
    this.anchor = anchor;
  }

  get size() {
    return { width: this.image.width, height: this.image.height };
  }

  render(x, y) {
    if (x === undefined) {
      x = this.x - this.image.width * this.anchor.x;
      y = this.y - this.image.height * this.anchor.y;
    }
    this.image.draw(x, y);
  }
}

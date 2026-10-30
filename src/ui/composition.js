import { Element } from "./element.js";

export class Composition extends Element {
  static VERTICAL = "vertical";
  static HORIZONTAL = "horizontal";

  constructor(x, y, direction = Composition.VERTICAL, gap = 0) {
    super();
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.gap = gap;
    this.items = [];
  }

  addItems(...items) {
    this.items.push(...items.flat());
  }

  getSize() {
    let width = 0;
    let height = 0;

    for (const item of this.items) {
      const size = item.getSize();
      if (this.direction === Composition.VERTICAL) {
        width = Math.max(width, size.width);
        height += size.height;
      } else {
        width += size.width;
        height = Math.max(height, size.height);
      }
    }

    const gaps = Math.max(0, this.items.length - 1) * this.gap;
    if (this.direction === Composition.VERTICAL) height += gaps;
    else width += gaps;

    return { width, height };
  }

  render() {
    let cursorX = this.x;
    let cursorY = this.y;

    for (const item of this.items) {
      const { x, y } = item.getPos();
      item.setPos({ x: cursorX + x, y: cursorY + y });
      item.render();
      item.resetPos();

      const size = item.getSize();
      if (this.direction === Composition.VERTICAL)
        cursorY += size.height + this.gap;
      else cursorX += size.width + this.gap;
    }
  }
}

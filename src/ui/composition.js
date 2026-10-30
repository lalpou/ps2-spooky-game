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
    this.spreadLength = null;
    this.items = [];
  }

  addItems(...items) {
    this.items.push(...items.flat());
  }

  spread(length) {
    this.spreadLength = length;
  }

  get isVertical() {
    return this.direction === Composition.VERTICAL;
  }

  gapFor(sizes) {
    if (this.spreadLength === null || sizes.length < 2) return this.gap;
    const used = sizes.reduce(
      (sum, size) => sum + (this.isVertical ? size.height : size.width),
      0,
    );
    return Math.max(0, (this.spreadLength - used) / (sizes.length - 1));
  }

  get size() {
    const sizes = this.items.map((item) => item.size);
    const gaps = Math.max(0, sizes.length - 1) * this.gapFor(sizes);

    let width = 0;
    let height = 0;
    for (const size of sizes) {
      if (this.isVertical) {
        width = Math.max(width, size.width);
        height += size.height;
      } else {
        width += size.width;
        height = Math.max(height, size.height);
      }
    }

    if (this.isVertical) height += gaps;
    else width += gaps;

    return { width, height };
  }

  render(x = this.x, y = this.y) {
    const sizes = this.items.map((item) => item.size);
    const gap = this.gapFor(sizes);

    this.items.forEach((item, i) => {
      // The item's own position is a nudge relative to its slot in the layout.
      this.renderItem(item, i, x + item.x, y + item.y);

      if (this.isVertical) y += sizes[i].height + gap;
      else x += sizes[i].width + gap;
    });
  }

  renderItem(item, index, x, y) {
    item.render(x, y);
  }
}

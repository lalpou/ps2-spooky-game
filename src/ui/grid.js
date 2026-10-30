import { Composition } from "./composition.js";

const activeColor = Color.new(255, 255, 255, 128);

export class Grid extends Composition {
  constructor(x, y, columns, gap = 10) {
    super(x, y, Composition.HORIZONTAL, gap);
    this.columns = columns;
    this.activeIndex = 0;
  }

  get active() {
    return this.items[this.activeIndex];
  }

  get size() {
    const cell = this.items[0].size;
    const columns = Math.min(this.columns, this.items.length);
    const rows = Math.ceil(this.items.length / this.columns);
    return {
      width: columns * (cell.width + this.gap) - this.gap,
      height: rows * (cell.height + this.gap) - this.gap,
    };
  }

  update(pad) {
    let index = this.activeIndex;
    if (pad.justPressed(Pads.LEFT)) index -= 1;
    if (pad.justPressed(Pads.RIGHT)) index += 1;
    if (pad.justPressed(Pads.UP)) index -= this.columns;
    if (pad.justPressed(Pads.DOWN)) index += this.columns;
    const count = this.items.length;
    this.activeIndex = ((index % count) + count) % count;
  }

  render(x = this.x, y = this.y) {
    const cell = this.items[0].size;
    this.items.forEach((item, i) => {
      const cellX = x + (i % this.columns) * (cell.width + this.gap);
      const cellY = y + Math.floor(i / this.columns) * (cell.height + this.gap);
      this.renderItem(item, i, cellX, cellY);
    });
  }

  renderItem(item, index, x, y) {
    if (index !== this.activeIndex) {
      item.render(x, y);
      return;
    }
    item.render(x, y, activeColor);
    const size = item.size;
    Draw.rect(
      Math.round(x),
      Math.round(y + size.height + 2),
      size.width,
      2,
      activeColor,
    );
  }
}

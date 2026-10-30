import { Composition } from "./composition.js";
import { Label } from "./label.js";

const activeColor = Color.new(255, 255, 255, 128);

export class Menu extends Composition {
  constructor(x, y, gap = 10) {
    super(x, y, Composition.VERTICAL, gap);
    this.activeIndex = 0;
    this.actions = new Map();
  }
  addOption(text, onSelect = () => {}) {
    const label = new Label(text);
    this.addItems(label);
    this.actions.set(label, onSelect);
    return label;
  }

  get active() {
    return this.items[this.activeIndex];
  }

  setActive(index) {
    const count = this.items.length;
    if (count === 0) return;
    this.activeIndex = ((index % count) + count) % count;
  }

  update(pad) {
    if (pad.justPressed(Pads.UP)) this.setActive(this.activeIndex - 1);
    if (pad.justPressed(Pads.DOWN)) this.setActive(this.activeIndex + 1);
    if (pad.justPressed(Pads.CROSS)) this.actions.get(this.active)();
  }

  renderItem(item, index, x, y) {
    if (index === this.activeIndex) item.render(x, y, activeColor);
    else item.render(x, y);
  }
}

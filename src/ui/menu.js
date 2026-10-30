import { Composition } from "./composition.js";

const activeColor = Color.new(255, 255, 255, 128);

export class Menu {
  constructor(x, y, gap = 10) {
    this.composition = new Composition(x, y, Composition.VERTICAL, gap);
    this.activeIndex = 0;
  }

  get items() {
    return this.composition.items;
  }

  addItems(...items) {
    this.composition.addItems(...items);
  }

  setPos(pos) {
    this.composition.setPos(pos);
  }

  getPos() {
    return this.composition.getPos();
  }

  getSize() {
    return this.composition.getSize();
  }

  getActiveIndex() {
    return this.activeIndex;
  }

  getActive() {
    return this.items[this.activeIndex];
  }

  setActive(index) {
    const count = this.items.length;
    if (count === 0) return;
    this.activeIndex = ((index % count) + count) % count;
  }

  update(pad, gamestate) {
    if (pad.justPressed(Pads.UP)) this.setActive(this.activeIndex - 1);
    if (pad.justPressed(Pads.DOWN)) this.setActive(this.activeIndex + 1);
    if (pad.justPressed(Pads.CROSS)) {
      switch (this.activeIndex) {
        case 0:
          gamestate.setState(1);
          break;
        default:
          break;
      }
    }
  }

  render() {
    const active = this.getActive();
    if (!active) {
      this.composition.render();
      return;
    }

    const oldColor = active.color;
    active.color = activeColor;
    this.composition.render();
    active.color = oldColor;
  }
}

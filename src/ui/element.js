export class Element {
  x = 0;
  y = 0;

  constructor() {
    if (new.target === Element) {
      throw new TypeError("Element is abstract, use a subclass");
    }
  }

  setPos(pos) {
    this.x = pos.x;
    this.y = pos.y;
  }

  get pos() {
    return { x: this.x, y: this.y };
  }

  get size() {
    throw new Error(`${this.constructor.name} must implement the size getter`);
  }

  render(x = this.x, y = this.y) {
    throw new Error(`${this.constructor.name} must implement render()`);
  }
}

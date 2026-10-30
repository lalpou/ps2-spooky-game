export class Element {
  x = 0;
  y = 0;

  constructor() {
    if (new.target === Element) {
      throw new TypeError("Element is abstract, use a subclass");
    }
  }

  setPos(pos) {
    this.prevX = this.x;
    this.prevY = this.y;
    this.x = pos.x;
    this.y = pos.y;
  }

  get pos() {
    return { x: this.x, y: this.y };
  }

  resetPos() {
    this.x = this.prevX;
    this.y = this.prevY;
  }

  render() {
    throw new Error(`${this.constructor.name} must implement render()`);
  }

  get size() {
    throw new Error(`${this.constructor.name} must implement the size getter`);
  }
}

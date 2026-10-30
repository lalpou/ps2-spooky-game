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

  getPos() {
    return { x: this.x, y: this.y };
  }

  resetPos() {
    this.x = this.prevX;
    this.y = this.prevY;
  }

  render() {
    throw new Error(`${this.constructor.name} must implement render()`);
  }

  /** @returns {{width: number, height: number}} */
  getSize() {
    throw new Error(`${this.constructor.name} must implement getSize()`);
  }
}

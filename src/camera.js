export class Camera2D {
  constructor(scale) {
    const { width, height } = Screen.getMode();
    this.x = 0;
    this.y = 0;
    this.scale = scale;
    this.halfW = width / 2;
    this.halfH = height / 2;
  }

  follow(target) {
    this.x = target.x;
    this.y = target.y;
  }

  toScreenX(wx) {
    return (wx - this.x) * this.scale + this.halfW;
  }

  toScreenY(wy) {
    return (wy - this.y) * this.scale + this.halfH;
  }
}

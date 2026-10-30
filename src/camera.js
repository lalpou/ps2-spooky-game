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
    const x = (wx - this.x) * this.scale + this.halfW;
    return Math.round(x);
  }

  toScreenY(wy) {
    const y = (wy - this.y) * this.scale + this.halfH;
    return Math.round(y);
  }
}

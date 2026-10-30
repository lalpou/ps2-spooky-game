export class Camera2D {
  /**
   * @param {number} scale pixels per cell
   * @param {{x: number, y: number, w: number, h: number}} [viewport] screen rectangle this camera draws into, defaults to the full screen
   */
  constructor(scale, viewport) {
    const { width, height } = Screen.getMode();
    this.screen = { width, height };
    this.viewport = viewport ?? { x: 0, y: 0, w: width, h: height };
    this.x = 0;
    this.y = 0;
    this.scale = scale;
    this.halfW = this.viewport.w / 2;
    this.halfH = this.viewport.h / 2;
  }

  /** Clips drawing to the viewport. Call `release` once done. */
  apply() {
    const { x, y, w, h } = this.viewport;
    Screen.setParam(Screen.SCISSOR_BOUNDS, {
      x1: x,
      y1: y,
      x2: x + w - 1,
      y2: y + h - 1,
    });
  }

  /** Restores clipping to the full screen. */
  release() {
    Screen.setParam(Screen.SCISSOR_BOUNDS, {
      x1: 0,
      y1: 0,
      x2: this.screen.width - 1,
      y2: this.screen.height - 1,
    });
  }

  follow(target) {
    this.x = target.x;
    this.y = target.y;
  }

  toScreenX(wx) {
    const x = (wx - this.x) * this.scale + this.viewport.x + this.halfW;
    return Math.round(x);
  }

  toScreenY(wy) {
    const y = (wy - this.y) * this.scale + this.viewport.y + this.halfH;
    return Math.round(y);
  }
}

export class Controller {
  constructor(pad, deadzone) {
    this.pad = Pads.get(pad);
    this.deadzone = deadzone;
  }

  getLeftStick() {
    let x = this.pad.lx / 128;
    let y = this.pad.ly / 128;

    const length = Math.hypot(x, y);
    if (length < this.deadzone) return { x: 0, y: 0 };
    if (length > 1) {
      x /= length;
      y /= length;
    }
    return { x, y };
  }

  update() {
    this.pad.update();
  }
}

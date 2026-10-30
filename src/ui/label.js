import { Element } from "./element.js";
import { BitmapFont } from "./bitmapfont.js";

// One shared font for all text. Made from Press Start 2P, see assets/fonts/OFL.txt.
const font = new BitmapFont("assets/fonts/pixel.png");

export class Label extends Element {
  /**
   * @param {string} text
   * @param {{color?: number, scale?: number}} style scale 1 is 16px; whole numbers keep pixels square
   */
  constructor(text, { color = Color.new(255, 255, 0, 128), scale = 1 } = {}) {
    super();
    this.text = text;
    this.color = color;
    this.scale = scale;
  }

  get size() {
    return font.measure(this.text, this.scale);
  }

  render(x = this.x, y = this.y, color = this.color) {
    font.print(x, y, this.text, this.scale, color);
  }
}

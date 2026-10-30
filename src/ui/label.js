import { Element } from "./element.js";

// Shared by all labels: Athena only loads the "default" font for the first
// new Font("default"); every later instance gets an empty font and draws nothing.
const defaultFont = new Font("default");

export class Label extends Element {
  /**
   * @param {string} text
   * @param {{color?: number, scale?: number, thickness?: number}} style
   */
  constructor(
    text,
    { color = Color.new(255, 255, 0, 128), scale = 1, thickness = 1 } = {},
  ) {
    super();
    this.text = text;
    this.font = defaultFont;
    this.color = color;
    this.scale = scale;
    this.thickness = thickness; // Faux bold in px, 0 for normal weight.
  }

  get size() {
    this.font.scale = this.scale;
    return this.font.getTextSize(this.text);
  }

  render(x = this.x, y = this.y, color = this.color) {
    this.font.color = color;
    this.font.scale = this.scale;
    this.font.outline = this.thickness;
    this.font.outline_color = color;
    this.font.print(x, y, this.text);
  }
}

import { Element } from "./element.js";

const defaultFont = new Font("default");

export class Label extends Element {
  x = 0;
  y = 0;
  constructor(label) {
    super();
    this.label = label;
    this.font = defaultFont;
    this.color = Color.new(255, 255, 0, 128);
    this.scale = 1;
    this.thickness = 1;
  }

  get size() {
    this.font.scale = this.scale;
    return this.font.getTextSize(this.label);
  }

  render() {
    this.font.color = this.color;
    this.font.scale = this.scale;
    this.font.outline = this.thickness;
    this.font.outline_color = this.color;
    this.font.print(this.x, this.y, this.label);
  }
}

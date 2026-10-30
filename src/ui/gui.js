import { Composition } from "./composition.js";
import { Label } from "./label.js";

export class Gui extends Composition {
  constructor(x, y, direction = Composition.HORIZONTAL, gap = 100) {
    super(x, y, direction, gap);
    this.fields = {};
  }

  addField(key, format, initial) {
    const label = new Label(format(initial));
    this.fields[key] = { label, format };
    this.addItems(label);
    return label;
  }

  update(updateObject) {
    for (const [key, value] of Object.entries(updateObject)) {
      const field = this.fields[key];
      if (field) field.label.text = field.format(value);
    }
  }
}

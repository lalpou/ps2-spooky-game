export class BitmapFont {
  constructor(path) {
    this.image = new Image(path);
    this.cell = this.image.width / 16;
  }

  measure(text, scale) {
    const size = this.cell * scale;
    return { width: text.length * size, height: size };
  }

  print(x, y, text, scale, color) {
    const { image, cell } = this;
    const size = cell * scale;
    image.color = color;
    image.width = size;
    image.height = size;

    x = Math.round(x);
    y = Math.round(y);
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code !== 32 && code < 256) {
        image.startx = (code % 16) * cell;
        image.starty = Math.floor(code / 16) * cell;
        image.endx = image.startx + cell;
        image.endy = image.starty + cell;
        image.draw(x + i * size, y);
      }
    }
  }
}

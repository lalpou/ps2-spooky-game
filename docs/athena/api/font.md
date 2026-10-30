### Font module

**Construction:**  
```js
let font = new Font(path);  // It supports png, bmp, jpg, otf, ttf.
```
  path - Path to a font file, E.g.: "images/atlas.png", "fonts/font.png".  
```js
let font = new Font("Segoe UI.ttf"); //Load trueType font 
``` 

**Properties:**
* color - Define font tinting, default value is Color.new(255, 255, 255, 128).
* scale - Proportional scale, default: 1.0f
* outline_color - Define outline tinting, default value is Color.new(0, 0, 0, 128).
* outline - Outline size, default: 0.0f
* dropshadow_color - Define dropshadow tinting, default value is Color.new(0, 0, 0, 128).
* dropshadow - Shadow drop position, default: 0.0f
* align - Font alignment, default value is FontAlign.NONE. Avaliable options below:  
  • Font.ALIGN_NONE  
  • Font.ALIGN_TOP  
  • Font.ALIGN_BOTTOM  
  • Font.ALIGN_LEFT  
  • Font.ALIGN_RIGHT  
  • Font.ALIGN_VCENTER  
  • Font.ALIGN_HCENTER  
  • Font.ALIGN_CENTER  
  

P.S.: outline and drop shadow do not coexist, so one of them must be 0.0f.

**Methods:**
* print(x, y, text) - Draw text on screen(call it every frame). Example: font.print(10.0, 10.0, "Hello world!);
* getTextSize(text) - Returns text absolute size in pixels (width, height). Example: const size = font.getTextSize("Hello world!");

### Image Module  
**Functions:**  
* Image.copyVRAMBlock(src_buffer, src_x, src_y, dest_buffer, dest_x, dest_y) - Copies a VRAM block from src_buffer to dest_buffer.
  
**Construction:**  

* let image = new Image(*path*, *async_list*);  
  *path* - Path to the file, E.g.: "images/test.png".  
  *async_list* - Gets a ImageList object, which is a asynchronous image loading list, if you want to load images in the background.  
```js
let test = new Image("owl.png"); 
``` 

**Properties:**

* width, height - Image drawing size, default value is the original image size.
* startx, starty - Beginning of the area that will be drawn from the image, the default value is 0.0.
* endx, endy - End of the area that will be drawn from the image, the default value is the original image size.
* angle - Define image rotation angle, default value is 0.0.
* color - Define image tinting, default value is Color.new(255, 255, 255, 128).
* filter - Choose between **LINEAR** or **NEAREST**, default value is NEAREST.
* size - Returns image real size occupied in memory.
* bpp - Bits per-pixel quantity.
* pixels - The image pixel ArrayBuffer.
* palette - If is a palette image, it has a palette ArrayBuffer right here.
* texWidth, texHeight - The real texture area in memory.
* renderable - Set if the texture can be used as a rendering buffer.

**Methods:**

* draw(x, y) - Draw loaded image onscreen(call it every frame). Example: image.draw(15.0, 100.0);
* optimize() - If your image has 24 bits per-pixel (aka RGB), you can use this to make it 16 bits per-pixel, saving some memory!
* lock() - Lock texture data in VRAM, useful when you deal with textures that are always needed or rendering buffers.
* unlock() - Unlock texture data in VRAM, so it can be replaced with more used textures.
* locked() - Returns true if the texture is locked in VRAM.
* ready() - Returns true if an asynchronous image was successfully loaded in memory. 
* free() - Free asset content immediately. P.S.: This is a way to quick free stuff from memory, but you can also wait for the garbage collector so it's not mandatory.
  
**ImageList**

**Construction:**

```js
let async_list = new ImageList(); // This constructor creates a new thread and a queue to load images in background, avoid building multiple ImageList objects.
```
**Methods:**

* process() - This method starts the thread and loads added images on the queue. 
```js
async_list.process();
```

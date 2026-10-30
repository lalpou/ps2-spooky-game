### TileMap module
The TileMap module exposes the descriptor/buffer-based API described in [docs/TILEMAP.md](docs/TILEMAP.md). It is split into a namespace with constructors and helpers:

**Available exports:**

* `TileMap.Descriptor(config)` – Create an immutable descriptor (textures array or `Image` objects, plus `materials` list with `texture_index`, `blend_mode`, `end_offset`).
* `TileMap.Instance({ descriptor, spriteBuffer })` – Bind a sprite buffer (`ArrayBuffer`) to a descriptor. Methods:
  • `render(x, y[, zindex])` – Draw at the specified offset.  
  • `replaceSpriteBuffer(buffer)` – Swap the current buffer pointer.  
  • `getSpriteBuffer()` – Returns the attached `ArrayBuffer` for direct mutation.  
  • `updateSprites(dstOffset, srcBuffer[, spriteCount])` – Copy a range of sprites from another buffer.
* `TileMap.SpriteBuffer.create(count)` – Allocate a zeroed buffer sized for `count` sprites.
* `TileMap.SpriteBuffer.fromObjects(array)` – Convert an array of JS objects (`x`, `y`, `w`, `h`, `u1`, `v1`, …) into a packed buffer.
* `TileMap.layout` – `{ stride, offsets }` helper for DataView/TypedArray math (fields: `x`, `y`, `w`, `h`, `u1`, `v1`, `u2`, `v2`, `r`, `g`, `b`, `a`, `zindex`).
* `TileMap.init()` / `TileMap.begin()` / `TileMap.setCamera(x, y)` – Low-level hooks to initialize the renderer, start a frame, and move the shared camera offset.

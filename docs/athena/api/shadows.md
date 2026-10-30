### Shadows module

The Shadows module provides real-time shadow projection capabilities using a grid-based approach with optional ODE ray casting for accurate shadow placement on 3D geometry.

**Constants:**

* Shadows.SHADOW_BLEND_DARKEN - Darken blend mode (default)
* Shadows.SHADOW_BLEND_ALPHA - Alpha blend mode  
* Shadows.SHADOW_BLEND_ADD - Additive blend mode

**Construction:**

```js
let projector = new Shadows.Projector(shadowTexture);
```
Creates a new shadow projector using the specified texture for the shadow appearance.

**Methods:**

* setSize(width, height) - Set the shadow projection area size in world units.
* setGrid(gridX, gridZ) - Set the grid resolution for shadow tessellation (minimum 2x2).
* setLightDir(x, y, z) - Set the directional light direction (automatically normalized).
* setBias(bias) - Set shadow bias to prevent z-fighting (default: 0.01).
* setLightOffset(offset) - Set offset along light direction to shift shadow center.
* setSlopeLimit(maxSlopeCos) - Set maximum slope angle for shadow projection (optional).
* setColor(r, g, b, a) - Set shadow color and alpha (0.0-1.0 range).
* setBlend(mode) - Set shadow blend mode (SHADOW_BLEND_* constants).
* setUVRect(u0, v0, u1, v1) - Set texture UV rectangle for shadow appearance.
* enableRaycast(space, rayLength, enable) - Enable/disable ODE ray casting for accurate shadow placement.
* render() - Render the shadow projector (call every frame).

**Properties:**

* position - Object with x, y, z keys for shadow projector world position.
* rotation - Object with x, y, z keys for shadow projector rotation (quaternion).
* scale - Object with x, y, z keys for shadow projector scale.

**Usage Example:**

```js
// Create shadow render target
const shadowRT = new Image();
shadowRT.filter = LINEAR;
shadowRT.renderable = true;
shadowRT.bpp = 32;
shadowRT.texWidth = 256;
shadowRT.texHeight = 256;
shadowRT.width = 256;
shadowRT.height = 256;
shadowRT.lock();

// Create shadow projector
const projector = new Shadows.Projector(shadowRT);
projector.setSize(2.0, 2.0);
projector.setGrid(12, 12);
projector.setLightDir(0.0, 1.0, 1.0);
projector.setBias(-0.02);
projector.setColor(0.0, 0.0, 0.0, 0.65);
projector.setBlend(Shadows.SHADOW_BLEND_DARKEN);
projector.enableRaycast(space, 4, 12.0);
projector.setLightOffset(1.0);

// In render loop
projector.position = { x: object.x, y: 0.0, z: object.z };
projector.render();
```

**Performance Notes:**

* Higher grid resolution provides smoother shadows but uses more vertices
* Ray casting provides accurate shadows but has performance cost
* Shadow projectors use VU1 pipeline for optimal performance
* Consider using lower resolution for distant or less important shadows

### RenderData module

**Construction:**

```js
let data = new RenderData(mesh, *texture*)
/* Load simple WaveFront OBJ files or vertex arrays.
MTL is supported on OBJs (including per-vertex colors and multi-texturing).
If you don't have a MTL file but you want to bind a texture on it,
just pass the image as a second argument if you want to use it. */
```
**Methods:**  

* getTexture(id) - Gets the nth texture object from the model.
* setTexture(id, texture) - Changes or sets the nth texture on models.
* free() - Free asset content immediately. P.S.: This is a way to quick free stuff from memory, but you can also wait for the garbage collector so it's not mandatory.
  
**Properties:**

* positions - Float32Array with x, y, z, adc for each vertex.
* normals - Float32Array with n1, n2, n3, adc for each vertex.
* texcoords - Float32Array with s, t, q, w for each vertex.
* colors - Float32Array with r, g, b, a for each vertex.
* pipeline - Rendering pipeline. Avaliable pipelines below:
  • Render.PL_NO_LIGHTS - Lights disabled, colors still working.  
  • Render.PL_SPECULAR - Diffuse and specular lights and colors enabled.  
  • Render.PL_DEFAULT - Default for textured models. Lights and colors enabled.  

* materials - Render.material array.
* material_indices - Render.materialIndex array.
* size - Vertex quantity.
* bounds - Mesh bounding box.

* accurate_clipping - Toggle accurate clipping.
* face_culling - Face culling mode. Default: Render.CULL_FACE_BACK. Avaliable modes below:  
  • Render.CULL_FACE_NONE  
  • Render.CULL_FACE_FRONT  
  • Render.CULL_FACE_BACK  

* texture_mapping - Toggle texture mapping. (it can be used to disable texturing on a whole textured model)
* shade_model - Flat = 0, Gouraud = 1.  
  
**Properties(skinned):**
* bones: Array - Skeleton bones data.  
  • position: Vector4 - Bone local position.  
  • rotation: Vector4 - Bone local rotation.  
  • scale: Vector4 - Bone local scale.  
  • inverse_bind: Matrix4 - Bone inverse bind matrix.

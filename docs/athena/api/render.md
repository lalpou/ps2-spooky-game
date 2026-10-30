### Render module

Always configure the screen z-buffer before rendering 3D:
```js
const canvas = Screen.getMode();
canvas.zbuffering = true;
canvas.psmz = Screen.Z16S;
Screen.setMode(canvas);
```

* `Render.init()` – Initializes internal renderer state (GS/VU microprograms, materials cache). Call once during boot.
* `Render.begin()` – Starts a render pass and resets batched state. Call once per frame before issuing draw calls.
* `Render.setView(fov = 60, nearClip = 1.0, farClip = 2000.0, width = 0.0, height = 0.0)` – Configures the default projection matrix. Width/height override the auto-derived aspect ratio when non-zero.
* `Render.materialColor(r, g, b, alpha = 1.0)` – Convenience helper that returns a `{r,g,b,a}` color object for materials.
* `Render.material(ambient, diffuse, specular, emission, transmittance, shininess, refraction, transmission_filter, dissolve, texture_id, bump_texture_id, ref_texture_id, decal_texture_id)` – Builds a material descriptor used by RenderData/RenderObject. Texture ids accept `-1` to disable a layer.
* `Render.materialIndex(index, end)` – Tags the vertex/material arrays so the renderer knows which faces should use each material slice.
* `Render.vertexList(positions, normals, texcoords, colors, materials, material_indices)` – Creates the structure expected by `new RenderData(...)`. Each typed array must use 4-component packing (xyzw, n1n2n3w, stqw, rgba).

Constants:
* `Render.PL_NO_LIGHTS`, `Render.PL_DEFAULT`, `Render.PL_SPECULAR` – Select the shading pipeline for RenderData.
* `Render.CULL_FACE_NONE`, `Render.CULL_FACE_BACK`, `Render.CULL_FACE_FRONT` – Face-culling modes consumed by RenderData/RenderObject.

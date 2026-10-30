### RenderObject module

**Construction:**

```js
let model = new RenderObject(render_data)
/* You need to build a RenderData first, RenderObject keeps with position, rotation   
and the individual object matrices */
```
**Methods:**  

* render() - Draws the object on screen.
* renderBounds() - Draws object bounding box.
* free() - Free asset content immediately. P.S.: This is a way to quick free stuff from memory, but you can also wait for the garbage collector so it's not mandatory.  
  
**Methods(skinned):**

* playAnim(anim, loop) - Play animation on a skinned RenderObject.
* isPlayingAnim(anim) -  Returns true if anim is being played.  

**Properties:**  

* position - Object with x, y and z keys that stores the object position. Default is {x:0, y:0, z:0}.
* rotation - Object with x, y and z keys that stores the object rotation. Default is {x:0, y:0, z:0}.
* scale - Object with x, y and z keys that stores the object scale. Default is {x:0, y:0, z:0}.
* transform: Matrix4 - Object RTS transform matrix.  

**Properties(skinned):**
* bone_matrices: Matrix4[] - Array of Matrix4 containing the current bone state.
* bones: Array - Current bones current data.  
  • position: Vector4 - Current bone local position.  
  • rotation: Vector4 - Current bone local rotation.  
  • scale: Vector4 - Current bone local scale.  
  • transform: Matrix4 - Current bone RTS matrix.  
  
**Camera**   
* Camera.position(x, y, z)  
* Camera.rotation(x, y, z)  
* Camera.target(x, y, z)  
* Camera.orbit(yaw, pitch)  
* Camera.turn(yaw, pitch)  
* Camera.pan(x, y)  
* Camera.dolly(distance)  
* Camera.zoom(distance)  
  
* Camera.update() - Update camera state (must be called every frame).  
  
**Lights**  
You have 4 lights to use in 3D scenes, use set to configure them.

* Lights.set(id, attribute, x, y, z)  
  • Avaliable light attributes: Lights.DIRECTION, Lights.AMBIENT, Lights.DIFFUSE

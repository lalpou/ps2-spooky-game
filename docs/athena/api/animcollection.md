### AnimCollection module

**Construction:**

```js
let walk_anims = new AnimCollection("walk_anims.gltf");
```
Loads an array map containing the animations inside the file, so you can either load them by index or name, for instance: for a anim called "run_fast", just pass as:
```js
character.playAnim(walk_anims["run_fast"], true);

// now you want it to be in idle animation, which can be the first animation on our array, so:
character.playAnim(walk_anims[0], true);
```

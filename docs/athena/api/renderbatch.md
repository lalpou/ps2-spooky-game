### RenderBatch (RenderBatch Module)

Construction:

* let batch = new Batch(options);  
  options.autoSort - Boolean (default: true). Enables internal state-aware sort.

Methods:

* add(renderObject) - Adds a RenderObject to the batch. Returns current count.
* clear() - Removes all objects from the batch.
* render() - Renders all objects in the batch using optimal state transitions. Returns number of draws.

Properties:

* size (read-only) - Number of objects currently in the batch.

Example:
```js
const batch = new Batch({ autoSort: true });
batch.add(new RenderObject(new RenderData("dragon.obj")));
batch.render();
```

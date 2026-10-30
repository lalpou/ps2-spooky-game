### AsyncLoader (RenderAsyncLoader Module)

Cooperative streaming helper executed on the main thread in small steps.

Construction:

* let loader = new AsyncLoader({ jobsPerStep });  
  jobsPerStep - Number (default: 1). How many items to process per process() call when budget is omitted.

Methods:

* enqueue(path, callback[, texture]) - Queues a model load.  
  - path: String (e.g., "BoxTextured.gltf").  
  - callback: Function (path, renderData) invoked when the item is ready.  
  - texture: optional Image to bind during load (may be null/omitted).
* process([budget]) - Processes up to budget items from the queue (or jobsPerStep if omitted). Returns number processed.
* clear() - Clears pending items and releases their callbacks.
* destroy() - Clears and destroys the loader.
* size() - Returns number of items still pending.
* getJobsPerStep() - Returns current jobs-per-step.
* setJobsPerStep(n) - Sets jobs-per-step, clamped to at least 1. Returns the applied value.

Example:
```js
const loader = new AsyncLoader({ jobsPerStep: 2 });
loader.enqueue("BoxTextured.gltf", (path, data) => {
  const obj = new RenderObject(data);
  sceneBatch.add(obj);
});

// In your frame loop
loader.process();
```

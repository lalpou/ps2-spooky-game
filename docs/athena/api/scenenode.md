### SceneNode (RenderSceneNode Module)

Construction:

* let node = new SceneNode();

Methods:

* addChild(node) - Parents a child SceneNode.
* removeChild(node) - Unparents a specific child.
* attach(renderObject) - Attaches a RenderObject to this node.
* detach([renderObject]) - Detaches the specific object or all when omitted.
* update() - Recomputes world transforms (rotate → scale → translate) for this subtree.

Properties:

* position { x, y, z }
* rotation { x, y, z }
* scale { x, y, z }

Example:
```js
const root = new SceneNode();
const child = new SceneNode();
const obj = new RenderObject(new RenderData("monkey.obj"));
child.position = { x: 0, y: 2, z: 0 };
child.attach(obj);
root.addChild(child);
root.update();
```

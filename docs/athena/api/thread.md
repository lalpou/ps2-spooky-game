### Thread module
**Functions:**
* Thread.list() - List all system threads (OS level, not JavaScript itself). List[Object[id, name, status, stack_size]]
* Thread.kill(id) - Force kill a thread from an internal ID.

**Construction:**
```js
const thread = new Thread(() => console.log("Hello from a thread!"), "Thread: Hello World!"); // Thread name is an optional parameter with 64 characters maximum size, useful to be tracked from Thread.list()
```
**Methods:**
* start() - Set the thread to an active state
* stop() - Finish thread execution, changing it to the state before calling start().

**Properties:**
* id - Thread internal ID
* name - Thread name

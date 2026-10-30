### Manual native compilation

The Native module provides an **Ahead-Of-Time (AOT) compiler** that translates JavaScript functions into native MIPS R5900 machine code for **40x+ performance** on math-heavy operations.

**Key features:**
* Compile JavaScript to native assembly
* Support for int, float, int64, arrays, strings, and custom structs
* Full control flow (if/else, loops, switch)
* Call Math functions (sqrt, abs, min, max, etc.)
* Struct methods with native performance
* 100+ optimized operations (strength reduction, constant folding, etc.)

#### Native.compile()

Compiles a JavaScript function to native code.

```js
const add = Native.compile({
    args: ['int', 'int'],
    returns: 'int'
}, (a, b) => a + b);

console.log(add(5, 3)); // 8 - runs at native speed!
```

**Supported type names:**
* **Integers**: `'int'`, `'uint'`, `'int64'`, `'uint64'`
* **Floats**: `'float'` (single precision)
* **Arrays**: `'Int32Array'`, `'Float32Array'`, `'Uint32Array'`
* **Strings**: `'string'`
* **Pointers**: `'ptr'`
* **Structs**: Use your struct name (e.g., `'Vec3'`)
* **Void**: `'void'` (return type only)

**Supported JavaScript features:**
* ✅ Arithmetic: `+`, `-`, `*`, `/`, `%`, `++`, `--`
* ✅ Bitwise: `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`
* ✅ Comparisons: `==`, `!=`, `<`, `<=`, `>`, `>=`
* ✅ Control flow: `if/else`, `for`, `while`, `do-while`, `switch`, `break`, `continue`
* ✅ **Math intrinsics** (compiled to native MIPS FPU instructions):
  * **Basic math:**
    * `Math.sqrt(x)` - Square root (SQRT.S instruction)
    * `Math.abs(x)` - Absolute value (ABS.S instruction)
    * `Math.min(a, b)` - Minimum (C.LT.S comparison)
    * `Math.max(a, b)` - Maximum (C.LT.S comparison)
  * **Integer operations:**
    * `Math.sign(x)` - Sign function (returns -1, 0, or 1)
    * `Math.imul(a, b)` - 32-bit integer multiplication
    * `Math.fround(x)` - Round to float32 (no-op on PS2, already float32)
  * **Advanced float operations:**
    * `Math.fma(a, b, c)` - Fused multiply-add: `a*b+c` (MADD.S instruction)
    * `Math.clamp(value, min, max)` - Clamp value to range
    * `Math.lerp(a, b, t)` - Linear interpolation: `a + (b-a)*t`
    * `Math.saturate(x)` - Clamp to [0, 1]
    * `Math.step(edge, x)` - Step function: `x >= edge ? 1 : 0`
    * `Math.smoothstep(e0, e1, x)` - Smooth interpolation (3rd order Hermite)
    * `Math.rsqrt(x)` - Reciprocal square root: `1/sqrt(x)`
* ✅ **String operations:**
  * String concatenation: `str1 + str2`
  * String comparison: `==`, `!=`
  * String passed as arguments and returned
* ✅ Typed array access: `array[i]`, `array[i] = value`
* ✅ Struct field access: `obj.x`, `obj.position[0]`
* ✅ Local variables and function parameters

**What's NOT supported:**
* ❌ Closures and capturing outer variables
* ❌ Calling JavaScript functions (only Math.* intrinsics and native functions)
* ❌ Dynamic typing (all types must be declared)
* ❌ Object/array creation inside native code (use passed arguments)
* ❌ Exceptions (try/catch)
* ❌ Regular expressions

**Calling external functions:**

You can call registered C functions using callbacks, but NOT JavaScript functions:

```js
// ❌ This WON'T work - can't call JS functions from native code
const helperJS = (x) => x * 2;
const bad = Native.compile({args: ['int'], returns: 'int'}, 
    (x) => helperJS(x)); // ERROR!

// ✅ This WORKS - Math functions are intrinsics
const good = Native.compile({args: ['float'], returns: 'float'},
    (x) => Math.sqrt(x * x + 1.0f));
```

**Control flow example:**
```js
const clamp = Native.compile({
    args: ['float', 'float', 'float'],
    returns: 'float'
}, (value, min, max) => {
    if (value < min) return min;
    if (value > max) return max;
    return value;
});

console.log(clamp(5.0f, 0.0f, 10.0f)); // 5.0
console.log(clamp(-1.0f, 0.0f, 10.0f)); // 0.0
console.log(clamp(15.0f, 0.0f, 10.0f)); // 10.0
```

**Loop example:**
```js
const dotProduct = Native.compile({
    args: ['Float32Array', 'Float32Array', 'int'],
    returns: 'float'
}, (a, b, length) => {
    let sum = 0.0f;
    for (let i = 0; i < length; i++) {
        sum += a[i] * b[i];
    }
    return sum;
});

const v1 = new Float32Array([1.0, 2.0, 3.0]);
const v2 = new Float32Array([4.0, 5.0, 6.0]);
console.log(dotProduct(v1, v2, 3)); // 32.0
```

**String example:**
```js
const greet = Native.compile({
    args: ['string', 'string'],
    returns: 'string'
}, (firstName, lastName) => {
    return firstName + " " + lastName;
});

console.log(greet("Athena", "Env")); // "Athena Env"
```

#### Native.struct()

Defines custom struct types with native performance and C-compatible memory layout.

**Construction:**
```js
const Vec3 = Native.struct('Vec3', {
    x: 'float',
    y: 'float',
    z: 'float'
}, {
    // Methods are compiled with 'self' as first argument
    length: Native.compile({
        args: ['self'],
        returns: 'float'
    }, (self) => {
        return Math.sqrt(self.x * self.x + 
                        self.y * self.y + 
                        self.z * self.z);
    }),
    
    scale: Native.compile({
        args: ['self', 'float'],
        returns: 'void'
    }, (self, factor) => {
        self.x *= factor;
        self.y *= factor;
        self.z *= factor;
    }),
    
    // Can also call other methods!
    normalize: Native.compile({
        args: ['self'],
        returns: 'void'
    }, (self) => {
        const len = Math.sqrt(self.x * self.x + 
                             self.y * self.y + 
                             self.z * self.z);
        if (len > 0.0f) {
            self.x /= len;
            self.y /= len;
            self.z /= len;
        }
    })
});
```

**Usage:**
```js
const v = new Vec3();
v.x = 3.0f;
v.y = 4.0f; 
v.z = 0.0f;
console.log(v.length()); // 5.0
v.scale(2.0f);
console.log(v.x); // 6.0
v.normalize();
console.log(v.x); // 0.6 (normalized)
```

**Array fields in structs:**
```js
const Transform = Native.struct('Transform', {
    position: {type: 'float', length: 3},  // float[3]
    rotation: {type: 'float', length: 4},  // float[4] (quaternion)
    scale: {type: 'float', length: 3}      // float[3]
});

const t = new Transform();
t.position[0] = 1.0f;
t.position[1] = 2.0f;
t.position[2] = 3.0f;
t.scale[0] = t.scale[1] = t.scale[2] = 1.0f;
```

#### Utility Functions

* `Native.free(func)` - Free compiled function immediately (optional, GC will handle it)
* `Native.getInfo(func)` - Get metadata: `{codeSize, argCount, returnType}`
* `Native.benchmark(func, iterations)` - Measure execution time in milliseconds
* `Native.disassemble(func)` - Get MIPS assembly listing (for debugging)

**Benchmarking example:**
```js
const func = Native.compile({args: ['int', 'int'], returns: 'int'},
    (a, b) => a * a + b * b);

const iterations = 1000000;
const timeMs = Native.benchmark(func, iterations);
const opsPerSec = (iterations / (timeMs / 1000)).toFixed(0);
console.log(`Performance: ${opsPerSec} ops/sec`);
```

**When to use Native.compile():**
* ✅ **Math-heavy loops** - Physics simulations, audio DSP, signal processing
* ✅ **Vector/matrix math** - 3D graphics, transformations
* ✅ **Array processing** - Image filters, particle updates
* ✅ **String operations** - Concatenation, comparison (basic operations)
* ✅ **Hot paths** - Any function called thousands of times per frame
* ❌ **Complex string parsing** - Regex, advanced manipulation
* ❌ **Complex logic** - If you need dynamic dispatch or closures
* ❌ **One-time calculations** - Compilation overhead not worth it

**Optimization tips:**
* Use `float` (with `f` suffix: `1.0f`) instead of double for 2x faster FPU ops
* Pass arrays instead of individual elements for batch processing
* Structs are passed by pointer (fast), primitives by value
* The compiler applies 5 optimization passes automatically

**Limitations:**
* Maximum 8 argument registers (use structs/arrays for more)
* Maximum expression depth: 8 levels
* No recursion support (stack frames are optimized away)
* No dynamic memory allocation inside native functions

**Technical details:** See `docs/NATIVE_COMPILER.md` for full IR opcodes, MIPS calling conventions, and implementation details.

**How to run it**

Athena is basically a JavaScript loader, so it loads .js files. It runs "main.js" by default, but you can run other file names by changing "athena.ini" default script or passing it as the first argument when launching the ELF file.

**Error reporting system**

Athena has a consistent error system, has two levels. 

**Runtime error:**  
A runtime error occurs on JavaScript side, it can be rich in debug data and easily fixable. It is capable of pointing the error type, custom message, files, lines and it even has
a color code.  
  
<img src="https://user-images.githubusercontent.com/47725160/230756861-94df60f8-8550-43a3-ac43-56d150e94145.png" width=50% height=50%>

**Core error:**  
A core error happens when AthenaEnv is interrupted due to a critical exception (null pointer, invalid address, bus error, overflow etc). It is a lot harder to debug and require low-level programming skills to figure out, from that screen you can get the exception cause, processor register dump, the bad address (if it is related with addresses), return function name(+offset) and the function that caused the error(+offset). It is highly recommended to contact the author to get proper support.  
  
<img src="https://github.com/user-attachments/assets/25da3350-cd53-4302-bf5e-3b7fdebcb4bb" width=50% height=50%>

<br />
<p align="center">
  <a href="https://github.com/DanielSant0s/AthenaEnv/">
    <img src="https://github.com/DanielSant0s/AthenaEnv/assets/47725160/f507ad9b-f9a1-4000-a454-ff824bc9d70b" alt="Logo" width="100%" height="auto">
  </a>

  <p align="center">
    Enhanced JavaScript environment for PlayStation 2™
    <br />
  </p>
</p>  


<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-athenaenv">About AthenaEnv</a>
      <ul>
        <li><a href="#function-types">Function types</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#coding">Coding</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#functions-classes-and-consts">Functions and classes</a></li>
      </ul>
    </li>
    <li><a href="#module-system">Module system</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#thanks">Thanks</a></li>
  </ol>
</details>

## About AthenaEnv

AthenaEnv is a complete JavaScript Runtime Environment for the PlayStation 2. It has dozens of built-in exclusive libraries made for the project, such as a MMI instruction accelerated 2D renderer, asynchronous texture manager system, an advanced 3D renderer powered by VU1 and VU0 and even a custom build HTTP/S client. It let's you to almost instantly write modern code on PS2 powered by performant libraries and a fine-tuned interpreter for it.

### Modules:
* System: Files, folders and system stuff.  
  • File operations  
  • Folder operations  
  • Mass device control  
  • Get machine info (CPU, GPU, memory, temperature)   
  • Native function control (call C functions)   
  • Load and use native dynamic libraries   

* Archive: A simple compressed file extractor.  
  • ZIP, GZ and TAR support   

* IOP: I/O driver and module manager.  
  • Module register  
  • I/O memory tracking  
  • Reverse init/end callbacks  
  • Smart reset routine  

* Image: Renderable surfaces.  
  • PNG, BMP and JPEG formats support  
  • Nearest and bilinear filters  
  • Off-screen rendering surfaces  
  • Surface cache system, with locks  
  • Asynchronous image list loading  

* Draw: Shape drawing.  
  • MMI accelerated  
  • Points  
  • Lines  
  • Rectangles  
  • Circles  
  • Triangles (flat, gouraud)  
  • Quads (flat, gouraud)  

* Render: High performance 3D renderer.  
  • VU1 vertex transformer  
  • VU0 matrix processor  
  • LookAt camera system  
  • Ambient lighting  
  • Diffuse lighting  
  • Specular lighting  
  • Polygon clipping  
  • (Back/Front)face culling  
  • Per-vertex colors  
  • Emboss bump mapping  
  • Skinning & node transforming  
  • Environment/Reflection maps  
  • Multiple material processing  
  • Frame stats API (draw calls/triangles) for live tuning  
  • Optional zero-copy vertex buffers via `Render.vertexList(..., { shareBuffers: true })`  
  • High-level helpers: batching (`Batch`), scene graph (`SceneNode`) and cooperative streaming (`AsyncLoader`).  

  Export model: AthenaEnv exports constructors on globalThis via ath_env (no imports from C modules):
  ```js
  const batch = new Batch({ autoSort: true });
  const root = new SceneNode();
  const loader = new AsyncLoader({ jobsPerStep: 2 });
  ```

* Screen: Rendering and video control.  
  • Screen control params (vsync, FPS)  
  • Render params (alpha, scissor, depth)  
  • Dual drawing context (optimized for off-screen drawing)  
  • Accelerated render loop  
  • Off-screen rendering  
  • Screenspace control  
  • Video modes  

* TileMap: High-throughput 2D tilemap renderer built on QuickJS + VU1.  
  • Descriptor/instance model for reusing textures/materials  
  • Sprite buffers exposed as `ArrayBuffer` (mutate via DataView/TypedArray)  
  • Material-aware batching and automatic texture uploads  
  • See `docs/TILEMAP.md` + "Functions, classes and consts" for API/usage  

* Font: Text rendering.  
  • MMI accelerated  
  • Render-time resizer  
  • FreeType and Image fonts  
  • Outline and dropshadow support  
  • Alignment support  

* Pads: DS2/3/4 input support.  
  • Gamepad type recognition  
  • Pressure sentivity  
  • Rumble support  
  • Connection states  
  • Callback events  

* Sound: Audio functions.  
  • ADPCM sound effects  
  • Automatic channel allocator  
  • Per-effect volume controller  
  • Pan and pitch control for effects  
  • WAV and OGG stream sound support  
  • Loop and position control for streams

* Video: MPEG Video playback.  
  • MPEG-1/2 playback support  
  • Playback control (play, pause, stop)


* Shadows: Real-time shadow projection system.  
  • Grid-based shadow projectors  
  • ODE ray casting integration  
  • Multiple blend modes (darken, alpha, add)  
  • Configurable shadow parameters  
  • VU1 accelerated rendering  
  • Dynamic shadow following  

* Network: Net basics and web requests.  
  • HTTP/HTTPS support  
  • TLS 1.2 support  
  • A/Sync requests (GET, POST, HEAD)  
  • Download functions  
  • Static/DHCP  

* Socket: Well, sockets.  
  • Classic sockets  
  • WebSockets  

* Timer: A simple time manager.  
  • Separated unique timers  
  • Resolution selectable  

* Keyboard: Basic USB keyboard support.
* Mouse: Basic USB mouse support.
New types are always being added and this list can grow a lot over time, so stay tuned.

### Built With

* [ps2dev](https://github.com/ps2dev/ps2dev)
* [QuickJS](https://bellard.org/quickjs/)

To learn how to build and customize: [Building AthenaEnv](docs/BUILDING_ATHENA.md)

## Coding

In this section you will have some information about how to code using AthenaEnv, from prerequisites to useful functions and information about the language.

### Prerequisites

Using AthenaEnv you only need one way to code and one way to test your code, that is, if you want, you can even create your code on PS2, but I'll leave some recommendations below.

* PC: [Visual Studio Code](https://code.visualstudio.com)(with JavaScript extension) and [PCSX2](https://pcsx2.net/download/development/dev-windows.html)(1.7.0 or above, enabled HostFS is required) or PS2Client for test.
* How to enable HostFS on PCSX2 1.7.0:  
  • (old) WxWidgets:  
![image](https://user-images.githubusercontent.com/47725160/145600021-b07dd873-137d-4364-91ec-7ace0b1936e2.png)  
  
  • Qt version:  
<img src="https://github.com/DanielSant0s/AthenaEnv/assets/47725160/e90471f6-7ada-4176-88e8-8a9d2c1e7eb4" width=50% height=50%>
  
Qt recommendation: Enable console output  
<img src="https://github.com/DanielSant0s/AthenaEnv/assets/47725160/7ced1570-0013-4072-ad01-66b8a63dab6e" width=50% height=50%>

  
* Android: [QuickEdit](https://play.google.com/store/apps/details?id=com.rhmsoft.edit&hl=pt_BR&gl=US) and a PS2 with wLE for test.

Oh, and I also have to mention that an essential prerequisite for using AthenaEnv is knowing how to code in JavaScript.

## Quick start with Athena

**Hello World:**  
```js
const font = new Font("default");

Screen.setParam(Screen.DEPTH_TEST_ENABLE, false); // Before doing 2D, disable depth!

os.setInterval(() => { // Basically creates an infinite loop, similar to while true(you can use it too).
  Screen.clear(); // Clear screen for the next frame.
  font.print(0, 0, "Hello World!"); // x, y, text
  Screen.flip(); // Updates the screen.
}, 0);
```
See more examples at [AthenaEnv samples](https://github.com/DanielSant0s/AthenaEnv/tree/main/bin).

### Features

AthenaEnv uses a slightly modified version of the QuickJS interpreter for JavaScript language, which means that it brings almost modern JavaScript features so far.

**Float32**

This project introduces a (old)new data type for JavaScript: single floats. Despite being less accurate than the classic doubles for number semantics, they are important for performance on the PS2, as the console only processes 32-bit floats on its FPU.

You can write single floats on AthenaEnv following the syntax below:
```js
let test_float = 15.0f; // The 'f' suffix makes QuickJS recognizes it as a single float.
``` 
or  
```js
let test_float = Math.fround(15.0); // Math.fround returns real single floats on Athena.
```

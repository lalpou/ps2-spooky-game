# AGENTS.md

PS2 game written in JavaScript on AthenaEnv (QuickJS-based PS2 runtime). Entry point is `main.js`, game code lives in `src/`.

## AthenaEnv docs

Local copy of the upstream docs is in `docs/athena/`. Use it instead of guessing APIs or relying on memory: AthenaEnv is niche and its API differs from browser/Node JS.

How to use it:

1. Start at `docs/athena/README.md` (index). It lists every file with a one-line description.
2. Read only the files you need. Do not load the whole folder.
   - Module API (functions, classes, constants): `docs/athena/api/<module>.md`, one file per module (`pads.md`, `screen.md`, `render.md`, `sound.md`, `ode.md`, ...).
   - General concepts, setup, quick start: `docs/athena/overview.md`.
   - `import` / native module loading: `docs/athena/module-system.md`.
   - Tilemaps: `docs/athena/guides/tilemap.md` and `docs/athena/api/tilemap.md`.
   - Native C compilation (`Native.compile`, `Native.struct`): `docs/athena/guides/native-compiler.md`.
   - Building the runtime itself: `docs/athena/guides/building-athena.md`.
3. To find where something is defined, grep: `grep -rn "Pads.update" docs/athena/api`. Module names map to file names in lowercase (`RenderObject module` is `api/renderobject.md`).
4. If a function or constant is not in the docs, say so and check upstream (https://github.com/DanielSant0s/AthenaEnv, sources in `src/js_api/`) before using it. Do not invent API.

## Writing code for AthenaEnv

- Target is a PS2: 32 MB RAM, no browser or Node APIs (no `window`, `document`, `fetch`, `require`). Available globals come from the AthenaEnv modules plus QuickJS `std` and `os`.
- Game loop: either `Screen.display(loopFn)` (auto clear/flip) or manual `Screen.clear()` / `Screen.flip()`. See `docs/athena/api/screen.md` and `api/pads.md` for input polling.
- Memory is tight. Resources like `Image`, `Video` and ODE bodies have `free()` for immediate release; otherwise the garbage collector handles them.

## Docs maintenance

- `docs/athena/` was generated from the upstream README and `docs/` on 2026-10-30. Content is verbatim, split per module.
- Do not hand-edit it to add project notes. Put project-specific notes in this file or elsewhere outside `docs/athena/`.

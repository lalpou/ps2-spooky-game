import { GameState } from "./src/gamestate.js";
import { World } from "./src/world.js";

Screen.setVSync(true);

const gamestate = new GameState(1);
const world = new World();
let lastState = null;

function init() {}

init();
while (true) {
  main_loop();
}

function main_loop() {
  Screen.clear();
  const state = gamestate.getState();
  const gameStateChanged = state !== lastState;
  lastState = state;
  switch (state) {
    case 0:
      //menu
      break;
    case 1:
      if (gameStateChanged) world.reset();
      world.render();
      //playing
      break;
    case 2:
      //game over
      break;
  }
  Screen.flip();
}

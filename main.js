import { GameState } from "./src/gamestate.js";
import { World } from "./src/world.js";

import { Label } from "./src/ui/label.js";
import { Menu } from "./src/ui/menu.js";

const canvas = Screen.getMode();
Screen.setVSync(true);

const gamestate = new GameState(0);
const world = new World();
let lastState = null;
const pad = Pads.get();

const menu = new Menu(0, 0, 10);
menu.addItems(
  new Label("Play (1P)"),
  new Label("Play (2P)"),
  new Label("Exit"),
);

const margin = 20;
menu.setPos({
  x: margin,
  y: canvas.height - menu.getSize().height - margin,
});

function init() {}

init();
while (true) {
  main_loop();
}

function main_loop() {
  Screen.clear();
  pad.update();
  const state = gamestate.getState();
  const gameStateChanged = state !== lastState;
  lastState = state;
  switch (state) {
    case 0:
      //menu
      menu.update(pad, gamestate);
      menu.render();
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

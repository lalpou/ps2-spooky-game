import { Controller } from "./src/controller.js";
import { GameState } from "./src/gamestate.js";
import { World } from "./src/world.js";
import { Menu } from "./src/ui/menu.js";
import { Gui } from "./src/ui/gui.js";

const canvas = Screen.getMode();

Screen.setVSync(true);

const gamestate = new GameState(1);
const world = new World();
let lastState = null;
const controller = new Controller(0, 0.1);

const menu = new Menu(0, 0, 10);
menu.addOption("Play (1P)", () => gamestate.setState(1));
menu.addOption("Play (2P)");
menu.addOption("Exit");
menu.setPos({
  x: 20,
  y: canvas.height - menu.size.height - 20,
});

const gui = new Gui(margin, margin);
gui.spread(canvas.width - margin * 2);
gui.addField("score", (score) => `Score: ${score}`, 0);
gui.addField("lives", (lives) => "O".repeat(Math.max(0, lives)), 3);
const frameTimer = Timer.new();
let t = Timer.getTime(frameTimer);

while (true) {
  main_loop();
}

function main_loop() {
  controller.update();
  const now = Timer.getTime(frameTimer);
  const dt = (now - t) / 1000000;
  t = now;

  Screen.clear();
  const state = gamestate.getState();
  const gameStateChanged = state !== lastState;
  lastState = state;
  switch (state) {
    case 0:
      //menu
      menu.update(controller.pad);
      menu.render();
      break;
    case 1:
      gui.render();
      if (gameStateChanged) world.reset();
      world.update(dt, controller);
      world.render();
      //playing
      break;
    case 2:
      //game over
      break;
  }

  Screen.flip();
}

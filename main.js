import { Maze } from "./src/maze.js";
import GameState from "./src/gamestate";

const canvas = Screen.getMode();

Screen.setVSync(true);
const maze = new Maze(50, 50);

const gamestate = new GameState(0);

while (true) {
  main_loop();
}

function main_loop() {
  Screen.clear();
  const state = gamestate.getState();
  switch (state) {
    case 0:
      //menu
      break;
    case 1:
      maze.render();
      //playing
      break;
    case 2:
      //game over
      break;
  }
  Screen.flip();
}

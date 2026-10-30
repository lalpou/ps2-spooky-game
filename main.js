import { Maze } from "./src/maze.js";

const canvas = Screen.getMode();
const image = new Image("assets/video_game_background.png");
image.width = canvas.width;
image.height = canvas.height;
Screen.setVSync(true);
const maze = new Maze(50, 50);

while (true) {
  main_loop();
}

function main_loop() {
  Screen.clear();
  maze.render();
  Screen.flip();
}

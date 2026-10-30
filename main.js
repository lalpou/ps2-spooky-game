import { Controller } from "./src/controller.js";
import { GameState } from "./src/gamestate.js";
import { World } from "./src/world.js";
import { Menu } from "./src/ui/menu.js";
import { Gui } from "./src/ui/gui.js";
import { Picture } from "./src/ui/picture.js";
import { Label } from "./src/ui/label.js";
import { Composition } from "./src/ui/composition.js";

const canvas = Screen.getMode();

Screen.setVSync(true);
Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Sound.setVolume(80);

const gamestate = new GameState(0);
const world = new World();
let lastState = null;
const controller = new Controller(0, 0.25);
let music = null;

function playMusic(path) {
  if (music) music.free();
  music = Sound.Stream(path);
  music.loop = true;
  music.play();
}

const margin = 20;

const menu = new Menu(0, 0, 10);
menu.addOption("Play (1P)", () => gamestate.setState(1));
menu.addOption("Play (2P)");
menu.addOption("Exit");
menu.setPos({
  x: margin,
  y: canvas.height - menu.size.height - margin,
});

const menuEnemy = new Picture("assets/enemy-south.png", 10, Picture.CENTER);
menuEnemy.setPos({
  x: canvas.width / 2 + 100,
  y: canvas.height / 2 + 100,
});

// Title above a Retry/Quit menu, centered as one block.
const gameOverMenu = new Menu(0, 0, 10);
gameOverMenu.addOption("Retry", () => {
  gamestate.setState(1);
});
gameOverMenu.addOption("Save & Quit", () => {
  gamestate.setState(3);
});

const gameOver = new Composition(0, 0, Composition.VERTICAL, 30);
gameOver.addItems(
  new Label("GAME OVER", { scale: 2, color: Color.new(255, 0, 0, 128) }),
  gameOverMenu,
);
gameOver.setPos({
  x: (canvas.width - gameOver.size.width) / 2,
  y: (canvas.height - gameOver.size.height) / 2,
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
      if (gameStateChanged) playMusic("assets/halloween-start-music.wav");
      //menu
      menuEnemy.render();
      menu.update(controller.pad);
      menu.render();
      break;
    case 1:
      if (gameStateChanged) {
        playMusic("assets/halloween-maze-song.wav");
        world.reset();
      }
      world.update(dt, controller);
      world.render();
      gui.render();
      break;
    case 2:
      gameOverMenu.update(controller.pad);
      gameOver.render();
      break;
    case 3:
      //enter name
      break;
    case 4:
      //scoreboard
      break;
  }

  Screen.flip();
}

import { Controller } from "./src/controller.js";
import { GameState } from "./src/gamestate.js";
import { World } from "./src/world.js";
import { Menu } from "./src/ui/menu.js";
import { Gui } from "./src/ui/gui.js";
import { Picture } from "./src/ui/picture.js";
import { Label } from "./src/ui/label.js";
import { Composition } from "./src/ui/composition.js";
import { Grid } from "./src/ui/grid.js";
import { loadScores, saveScore } from "./src/scores.js";

const canvas = Screen.getMode();

Screen.setVSync(true);
Screen.setParam(Screen.DEPTH_TEST_ENABLE, false);
Sound.setVolume(80);

const gamestate = new GameState(0);
const world = new World();
let lastState = null;
const controllerOne = new Controller(0, 0.25);
const controllerTwo = new Controller(1, 0.25);
let music = null;
let score = 0;

function playMusic(path) {
  if (music) music.free();
  music = Sound.Stream(path);
  music.loop = true;
  music.play();
}

const margin = 20;

const menu = new Menu(0, 0, 10);
menu.addOption("Play", () => gamestate.setState(1));
menu.addOption("Scoreboard", () => gamestate.setState(4));
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

const letters = new Grid(0, 0, 7);
for (let code = 65; code <= 90; code++) {
  letters.addItems(new Label(String.fromCharCode(code), { scale: 1.5 }));
}

const nameLength = 3;
let playerName = "";
const nameLabel = new Label("", { scale: 2 });
const saveHint = new Label("Press START to save");
const hintReady = Color.new(255, 255, 255, 128);
const hintWaiting = Color.new(100, 100, 100, 128);

function setName(name) {
  playerName = name.slice(0, nameLength);
  nameLabel.text = (playerName + "___").slice(0, nameLength);
  saveHint.color = playerName ? hintReady : hintWaiting;
}
setName("");

const nameEntry = new Composition(0, 0, Composition.VERTICAL, 20);
nameEntry.addItems(nameLabel, letters, saveHint);
nameEntry.setPos({
  x: (canvas.width - nameEntry.size.width) / 2,
  y: (canvas.height - nameEntry.size.height) / 2,
});

let scoreboard = null;

function buildScoreboard() {
  const board = new Composition(0, 0, Composition.VERTICAL, 12);
  board.addItems(new Label("HIGH SCORES", { scale: 2 }));

  const top = loadScores().slice(0, 5);
  if (top.length === 0)
    board.addItems(new Label("No scores yet", { color: hintReady }));
  top.forEach((entry, i) => {
    const name = (entry.name + "   ").slice(0, 3);
    const points = ("     " + entry.score).slice(-5);
    board.addItems(
      new Label(`${i + 1}. ${name} ${points}`, { color: hintReady }),
    );
  });

  board.addItems(new Label("Press O to go back", { color: hintWaiting }));
  board.setPos({
    x: (canvas.width - board.size.width) / 2,
    y: (canvas.height - board.size.height) / 2,
  });
  return board;
}

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
  controllerOne.update();
  controllerTwo.update();
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
      menu.update(controllerOne.pad);
      menu.render();
      break;
    case 1:
      if (gameStateChanged) {
        playMusic("assets/halloween-maze-song.wav");
        world.reset();
        score = 0;
        gui.update({ score });
      }
      world.update(dt, controllerOne, controllerTwo);
      world.render();
      gui.render();
      if (world.isPlayerDead()) gamestate.setState(2);
      else if (world.hasReachedExit()) gamestate.setState(5);
      break;
    case 2:
      gameOverMenu.update(controllerOne.pad);
      gameOver.render();
      break;
    case 3: {
      const pad = controller.pad;
      if (gameStateChanged) setName("");
      letters.update(pad);
      if (pad.justPressed(Pads.CROSS))
        setName(playerName + letters.active.text);
      if (pad.justPressed(Pads.CIRCLE)) setName(playerName.slice(0, -1));
      if (pad.justPressed(Pads.START) && playerName) {
        saveScore(playerName, score);
        gamestate.setState(4);
      }
      nameEntry.render();
      break;
    }
    case 4:
      if (gameStateChanged) scoreboard = buildScoreboard();
      if (controller.pad.justPressed(Pads.CIRCLE)) gamestate.setState(0);
      scoreboard.render();
      break;
    case 5:
      //win
      break;
  }

  Screen.flip();
}

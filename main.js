const canvas = Screen.getMode();
const image = new Image("assets/video_game_background.png");
image.width = canvas.width;
image.height = canvas.height;
Screen.setVSync(true);

while (true) {
  main_loop();
}

function main_loop() {
  Screen.clear();
  image.draw(0, 0);
  Screen.flip();
}

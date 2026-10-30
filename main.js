const canvas = Screen.getMode();
const image = new Image("assets/video_game_background.png");
image.width = canvas.width;
image.height = canvas.height;

Screen.setFrameCounter(bool);
Screen.setVSync(true);
Screen.waitVblankStart();

os.setInterval(() => {
  main_loop();
}, 0);

function main_loop() {
  // Basically creates an infinite loop, similar to while true(you can use it too).
  Screen.clear(); // Clear screen for the next frame.
  image.draw(0, 0);
  Screen.flip(); // Updates the screen.
}

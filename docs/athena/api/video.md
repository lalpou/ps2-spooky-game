### Video module

**Construction:**

* let video = new Video(path)
  path - Path to the MPEG file, E.g.: "videos/intro.mpg".

**Properties:**

* width (read-only) - Video width in pixels.
* height (read-only) - Video height in pixels.
* fps (read-only) - Video frames per second.
* ready (read-only) - Returns true if the video is loaded and ready for playback.
* ended (read-only) - Returns true if playback has finished.
* playing (read-only) - Returns true if video is currently playing.
* loop - Boolean to enable/disable Looping.
* frame (read-only) - Returns the current frame as an Image object (useful for use as texture).
* currentFrame (read-only) - Returns the current frame index.

**Methods:**

* play() - Start or resume playback.
* pause() - Pause playback.
* stop() - Stop playback and reset to beginning.
* update() - Process video decoding (call it every frame). Returns true if a new frame was decoded.
* draw(x, y, *w*, *h*) - Draw the current video frame to screen.
* free() - Release video resources.

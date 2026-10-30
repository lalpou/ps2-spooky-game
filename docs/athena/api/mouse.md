### Mouse module
* Mouse.init() - Initialize mouse routines.
* let mouse = Mouse.get() - Returns mouse actual properties on the object format below:  
  • mouse.x  
  • mouse.y  
  • mouse.wheel  
  • mouse.buttons  
* Mouse.setBoundary(minx, maxx, miny, maxy) - Set mouse x and y bounds.
* let mode = Mouse.getMode() - Get mouse mode(absolute or relative).
* Mouse.setMode(mode) - Set mouse mode.
* let accel = Mouse.getAccel() - Get mouse acceleration.
* Mouse.setAccel(val) - Set mouse acceleration.
* Mouse.setPosition(x, y) - Set mouse pointer position.

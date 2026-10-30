### Pads module

* Buttons list:  
  • Pads.SELECT  
  • Pads.START  
  • Pads.UP  
  • Pads.RIGHT  
  • Pads.DOWN  
  • Pads.LEFT  
  • Pads.TRIANGLE  
  • Pads.CIRCLE  
  • Pads.CROSS  
  • Pads.SQUARE  
  • Pads.L1  
  • Pads.R1  
  • Pads.L2  
  • Pads.R2  
  • Pads.L3  
  • Pads.R3  

* let pad = Pads.get(*port*) - Returns a pad object:  
**Properties:**  
  • pad.btns - Button state on the current check.  
  • pad.old_btns = Button state on the last check.  
  • pad.lx - Left analog horizontal position (left = -127, default = 0, right = 128).  
  • pad.ly - Left analog vertical position (up = -127, default = 0, down = 128).  
  • pad.rx - Right analog horizontal position (left = -127, default = 0, right = 128).  
  • pad.ry - Right analog vertical position (up = -127, default = 0, down = 128).  
    
  ![analog_graph](https://user-images.githubusercontent.com/47725160/154816009-99d7e5da-badf-409b-9a3b-3618fd372f09.png)  
  
**Methods:**  
  • update() - Updates all pads pressed and stick positions data.  
  • pressed(button) - Checks if a button is being pressed (continuously).  
  • justPressed(button) - Checks if a button was pressed only once.  
  • setEventHandler() - Sets the pad object to listen events defined by Pads.newEvent, so it doesn't need to be updated.  
  
* let event_id = Pads.newEvent(button, kind, function) - Creates an asynchronous pad event, returns the event id. Remember to set the pad object event handler first!
* Pad event kinds:  
  • Pads.PRESSED  
  • Pads.JUST_PRESSED  
  • Pads.NON_PRESSED  
* Pads.deleteEvent(event_id) - Deletes the event created by Pads.newEvent.
* let type = Pads.getType(*port*) - Gets gamepad type in the specified port.
* Pad Types:  
  • Pads.DIGITAL  
  • Pads.ANALOG  
  • Pads.DUALSHOCK  

* let press = Pads.getPressure(*port*, button) - Get button pressure level.
* Pads.rumble(port, big, small) - Rumble your gamepad.
* let count = Pads.getConnectedCount() – Returns the number of gamepads currently connected.
* let ports = Pads.getConnected() – Returns an array containing the ports of all connected gamepads. Example: [0], [1], or [0, 1].
* let active = Pads.isActive(port) – Checks whether the specified port is active and ready to receive input.

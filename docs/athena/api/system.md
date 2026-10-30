### System module
* let ret = System.nativeCall(address, arguments, *return_type*)  
  • address - Memory address of the native function.  
  • arguments - Array of arguments for the function, details below:  
    • Argument model: {type: System.T_X, value: X}, types below:
      • System.T_LONG  
      • System.T_ULONG  
      • System.T_INT  
      • System.T_UINT  
      • System.T_SHORT  
      • System.T_USHORT  
      • System.T_CHAR  
      • System.T_UCHAR  
      • System.T_PTR  
      • System.T_BOOL  
      • System.T_FLOAT  
      • System.T_STRING  
      • System.JS_BUFFER - ArrayBuffer  
  • return_type - Use one of the types above, or simply omit for void.  
* let reloc_id = System.loadReloc(path) - Loads a relocatable code (library or module)
* System.unloadReloc(reloc_id) - Unloads it from memory. P.S.: DANGER!!! Assures that you aren't using code from it.
* let symbol_addr = System.findRelocObject("symbol_name") - Find object inside Athena binary or a relocatable code/data
* let symbol_addr = System.findRelocLocalObject(reloc_id, "symbol_name") - Find object inside a relocatable code/data
* let info = System.getBDMInfo("mass0") - Gets info about the BDM device. E.g.: {name: "usb", index:0}
* let result = System.mount(mountpoint, device, *mode*)
* let result = System.umount(path)
* System.devices() - Array with avaliable devices: {name, desc}
* let listdir = System.listDir(*path*)
  • listdir[index].name - return file name on indicated index(string)  
  • listdir[index].size - return file size on indicated index(integer)  
  • listdir[index].directory - return if indicated index is a file or a directory(bool)  
* System.removeDirectory(path)
* System.copyFile(source, dest)
* System.moveFile(source, dest)
* System.rename(source, dest)
* System.sleep(sec)
* System.exitToBrowser()
* System.setDarkMode(value)
* let temps = System.getTemperature() // It only works with SCPH-500XX and later models.
* let info = System.getMCInfo(slot)  
  • info.type  
  • info.freemem  
  • info.format  
  
* let ee_info = System.getCPUInfo()  
  • ee_info.implementation  
  • ee_info.revision  
  • ee_info.FPUimplementation  
  • ee_info.FPUrevision  
  • ee_info.ICacheSize  
  • ee_info.DCacheSize  
  • ee_info.RAMSize  
  • ee_info.MachineSize  
  
* let gs_info = System.getGPUInfo()  
  • gs_info.id  
  • gs_info.revision  
  
* let ram_usage = System.getMemoryStats()  
  • ram_usage.core - Kernel + Native code size in RAM  
  • ram_usage.nativeStack - Kernel + Native stack size  
  • ram_usage.allocs - Dynamic allocated memory tracking  
  • ram_usage.used - All above, but combined  
  
Asynchronous functions:  
* System.threadCopyFile(source, dest)
* let progress = System.getFileProgress()  
  • progress.current  
  • progress.final

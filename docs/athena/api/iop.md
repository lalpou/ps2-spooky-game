### IOP module

* const module = IOP.newModule(name, data, *arg_len*, *args*) - data can be a string when it is a file or an ArrayBuffer when loading from memory.
* IOP.loadModule(module, arg) - Loads an IOP module created by newModule.
* IOP.reset()
* let stats = IOP.getMemoryStats()  
  • stats.free  
  • stats.used

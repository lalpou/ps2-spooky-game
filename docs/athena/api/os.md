### os module
The os module provides Operating System specific functions:

* low level file access
* signals
* timers
* asynchronous I/O
The OS functions usually return 0 if OK or an OS specific negative error code.

**Available exports:**

* let fd = os.open(filename, flags, mode = 0o666) - Open a file. Return a handle or < 0 if error.
Flags:  
  • os.O_RDONLY  
  • os.O_WRONLY  
  • os.O_RDWR  
  • os.O_APPEND  
  • os.O_CREAT  
  • os.O_EXCL  
  • os.O_TRUNC  
POSIX open flags.

* os.close(fd) - Close the file handle fd.
* os.seek(fd, offset, whence) - Seek in the file. Use std.SEEK_* for whence. offset is either a number or a bigint. If offset is a bigint, a bigint is returned too.
* os.read(fd, buffer, offset, length) - Read length bytes from the file handle fd to the ArrayBuffer buffer at byte position offset. Return the number of read bytes or < 0 if error.
* os.write(fd, buffer, offset, length) - Write length bytes to the file handle fd from the ArrayBuffer buffer at byte position offset. Return the number of written bytes or < 0 if error.
* os.remove(filename) - Remove a file. Return 0 if OK or -errno.
* os.rename(oldname, newname) - Rename a file. Return 0 if OK or -errno.
* os.realpath(path) - Return [str, err] where str is the canonicalized absolute pathname of path and err the error code.
* os.getcwd() - Return [str, err] where str is the current working directory and err the error code.
* os.chdir(path) - Change the current directory. Return 0 if OK or -errno.
* os.mkdir(path, mode = 0o777) - Create a directory at path. Return 0 if OK or -errno.
* os.stat(path), os.lstat(path) - Return [obj, err] where obj is an object containing the file status of path. err is the error code. The following fields are defined in obj: dev, ino, mode, nlink, uid, gid, rdev, size, blocks, atime, mtime, ctime. The times are specified in milliseconds since 1970. lstat() is the same as stat() excepts that it returns information about the link itself.  
Constants to interpret the mode property returned by stat(). They have the same value as in the C system header sys/stat.h.  
  • os.S_IFMT  
  • os.S_IFIFO  
  • os.S_IFCHR  
  • os.S_IFDIR  
  • os.S_IFBLK  
  • os.S_IFREG  
  • os.S_IFSOCK  
  • os.S_IFLNK  
  • os.S_ISGID  
  • os.S_ISUID  
  
* os.utimes(path, atime, mtime) - Change the access and modification times of the file path. The times are specified in milliseconds since 1970. Return 0 if OK or -errno.
* os.readdir(path) - Return [array, err] where array is an array of strings containing the filenames of the directory path. err is the error code.
* os.setReadHandler(fd, func) - Add a read handler to the file handle fd. func is called each time there is data pending for fd. A single read handler per file handle is supported. Use func = null to remove the handler.
* os.setWriteHandler(fd, func) - Add a write handler to the file handle fd. func is called each time data can be written to fd. A single write handler per file handle is supported. Use func = null to remove the handler.
* os.sleep(delay_ms) - Sleep during delay_ms milliseconds.
* os.setTimeout(func, delay) - Call the function func after delay ms. Return a handle to the timer.
* os.setInterval(func, interval) - Call the function func at specified intervals (in milliseconds). Return a handle to the timer.
* os.setImmediate(func)	- Executes a given function immediately.
* os.clearTimeout(handle) - Cancel a timer.
* os.clearInterval(handle) - Cancel a interval.
* os.clearImmediate(handle) - Cancel a immediate execution.
* os.platform - Return a string representing the platform: "ps2".

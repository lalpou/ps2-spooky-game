### Socket module

**Properties:**

* Socket.AF_INET
* Socket.SOCK_STREAM
* Socket.SOCK_DGRAM
* Socket.SOCK_RAW

**Construction:**  

* let s = new Socket(domain, type)  
```js
let s = new Socket(Socket.AF_INET, Socket.SOCK_STREAM);
```

**Methods:**

* connect(host, port)
* bind(host, port)
* listen()
* send(data) - Send data with Buffer
* recv(size) - Receive data to a buffer
* close()

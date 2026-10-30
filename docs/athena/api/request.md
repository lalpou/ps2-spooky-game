### Request module

**Construction:**  

* let r = new Request()  
```js
let r = new Request();
```

**Properties:**

* keepalive - bool
* useragent - string
* userpwd - string
* headers - string array

**Methods:**

* get(url)
* head(url)
* post(url, data)
* download(url, fname)  
  
**Asynchronous methods:**  
* asyncGet(url)
* asyncDownload(url, fname)
* ready(*timeout*, *conn_timeout*)
* getAsyncData()
* getAsyncSize()

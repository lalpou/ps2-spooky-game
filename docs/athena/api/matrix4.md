### Matrix4 Module  

**Construction:**  

* let mat = new Matrix4(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16)  
or
* let mat = new Matrix4() - No arguments means identity matrix.
```js
let test = new Matrix4(); 
``` 

**Properties:**

* length - 16.

**Methods:**

* toArray() - Returns an array from the matrix.
* fromArray() - Puts the first 16 numbers of the array as the matrix elements.
* clone() - Create a new clone of the given matrix.
* copy(mat) - Copy the matrix contents to the given matrix.
* transpose() - Transpose matrix.
* invert() - Calculate matrix inverse.
* identity() - Put matrix identity.

**Operators:** 

* mul: *
* eq: ==

P.S.: Matrix4 module components can be accessed as an array, so... mat[n] from 0 to 15.

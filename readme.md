Code for console.log in WebAssembly
```javascript
const importObject = {
console: {
log: (value) => console.log(value)  // Define the imported 'log' function
}
};

const wasmInstance = new WebAssembly.Instance(wasmModule, importObject);
const { _start } = wasmInstance.exports;
const now = Date.now()
_start();  // Call the exported _start function
const later = Date.now()
console.log("Time spent " + (later-now)/1000)
```

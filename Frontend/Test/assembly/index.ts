// The entry file of your WebAssembly module.

export function main(): void {
  let startTime = Date.now();
  let iterations: f64 = 10000000;
  for (let i: f64 = 0; i < iterations; i++) {
    if(i<100 && i >= 0){
        console.log(i.toString());
    }
  }
    let endTime = Date.now();

  console.log("Time taken: " + (endTime - startTime).toString() + "ms");
}

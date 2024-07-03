// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export function subtract(a: i32, b: i32): i32 {
  return a - b;
}

export function multiply(a: i32, b: i32): i32 {
  return a * b;
}

export function divide(a: i32, b: i32): i32 {
  return a / b;
}

export function remainder(a: i32, b: i32): i32 {
  return a % b;
}

export function power(a: i32, b: i32): i32 {
  if(b == 0) {
    return 1;
  }

  if(a == 0){
    return 0;
  }

  return a * power(a, b-1);
}

// The entry file of your WebAssembly module.

export function calculate(val1: f64, val2: f64, operator: String): f64 {
  if(operator == '+') {
    return add(val1, val2);
  }
  if(operator == '-') {
    return subtract(val1, val2);
  }
  if(operator == '*') {
    return multiply(val1, val2);
  }
  if(operator == '/') {
      return divide(val1, val2);
  }
  if(operator == '%') {
      return remainder(val1, val2);
  }
    if(operator == 'log') {
        return log(val1);
    }
    if(operator == 'sqrt') {
        return sqrt(val1);
    }
    if(operator == 'sin') {
        return sin(val1);
    }
    if(operator == 'cos') {
        return cos(val1);
    }
    if(operator == 'tan') {
        return tan(val1);
    }
    if(operator == 'asin') {
        return asin(val1);
    }
    if(operator == 'acos') {
        return acos(val1);
    }
    if(operator == 'atan') {
        return atan(val1);
    }
    if(operator == '**') {
        return power(val1, val2);
    }
    if(operator == '!') {
        return factorial(val1);
    }
    if(operator == 'log') {
        return log(val1);
    }
    throw new Error("Invalid operator");
}

function add(a: f64, b: f64): f64 {
  return a + b;
}

function subtract(a: f64, b: f64): f64 {
  return a - b;
}

function multiply(a: f64, b: f64): f64 {
  return a * b;
}

function divide(a: f64, b: f64): f64 {
  return a / b;
}

function remainder(a: f64, b: f64): f64 {
  return a % b;
}

function power(a: f64, b: f64): f64 {
  if(b == 0) {
    return 1;
  }

  if(a == 0){
    return 0;
  }

  return a * power(a, b-1);
}

function factorial(a: f64): f64 {
  if(a == 0) {
    return 1;
  }

  return a * factorial(a-1);
}

function sqrt(a: f64): f64 {
  return Math.sqrt(a);
}


function log(a: f64): f64 {
  return Math.log(a);
}

function sin(a: f64): f64 {
  return Math.sin(a);
}

function cos(a: f64): f64 {
  return Math.cos(a);
}

function tan(a: f64): f64 {
  return Math.tan(a);
}

function asin(a: f64): f64 {
  return Math.asin(a);
}

function acos(a: f64): f64 {
  return Math.acos(a);
}

function atan(a: f64): f64 {
  return Math.atan(a);
}

const examples = [
    {
        "name": "Small for loop",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  for (int i = 0; i < 10; i++) {
    print(i);
  }
}`
    },
    {
        "name": "Big for loop",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  int iterations = 5000000;
  for (int i = 0; i < iterations; i=i+1) {
    if(i < 100) {
      print(i);
    }
  }
  print("Total iterations: " + iterations);
}`
    },
    {
        "name": "Fibonacci",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  int a = 0;
  int b = 1;
  int c = 0;
  for (int i = 0; i < 10; i++) {
    print(a);
    c = a;
    a = b;
    b = c + b;
  }
}`
    },
    {
        "name": "Factorial",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  int n = 5;
  int result = 1;
  for (int i = 1; i <= n; i++) {
    result = result * i;
  }
  print(result);
}`
    },
    {
        "name": "Fibonacci recursive",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


int fib(int n) {
  if (n <= 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}

export void _start() {
  for (int i = 0; i < 10; i++) {
    print(fib(i));
  }
}`
    },
    {
        "name": "Simple if statement",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  int a = 5;
  if (a == 5) {
    print("a is " + a);
  } else {
    print("a is not 5");
  }
}`
    },
    {
        "name": "Simple while loop",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  int i = 0;
  while (i < 10) {
    print(i);
    i++;
  }
}`
    },
    {
        "name": "Simple function",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


int add(int a, int b) {
  return a + b;
}

export void _start() {
  print(add(5, 3));
}`
    },
    {
        "name": "Scan and print examples",
        "code": `import "console" "print" void print(string value);
import "js" "toStringDouble" int toStringDouble(double value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);
import "js" "scanBool" bool scanBool(string text);
import "js" "scanString" string scanString(string text);
import "js" "scanInt" int scanInt(string text);
import "js" "scanDouble" double scanDouble(string text);

export void _start() {
  bool b = scanBool("Enter bool");
  print(b);
  int p = scanInt("Enter int");
  print(10);
  print(p);
  double d = scanDouble("Enter double");
  print(11.5);
  print(d);
  string str1 = scanString("Enter str1");
  print(str1);
  string str2 = scanString("Enter str2");
  print(str2);
  string concatinatedString = concat(str1, str2);
  print(concatinatedString);
}`
    },
    {
        "name": "Scan and print bool",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "scanBool" bool scanBool(string text);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  bool b = scanBool("Enter bool");
  print(b);
}`
    },
    {
        "name": "Simple array",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  int[5] arr = [1, 2, 3, 4, 5];
  for (int i = 0; i < 5; i++) {
    print(arr[i]);
  }
}`
    },
    {
        "name": "Simple array sum",
        "code": `import "console" "print" void print(string value);
import "js" "toStringInt" string toStringInt(int value);
import "js" "toStringBool" string toStringBool(bool value);
import "js" "concat" string concat(string str1, string str2);


export void _start() {
  int[5] arr = [1, 2, 3, 4, 5];
  int sum = 0;
  for (int i = 0; i < 5; i++) {
    sum = sum + arr[i];
  }
  print(sum);
}`
    }
];

document.addEventListener("DOMContentLoaded", function () {
    let exampleSelect = document.getElementById("examples");
    let codeArea = document.getElementById("code");

    if (exampleSelect && (codeArea || codeEditor)) {
        examples.forEach((example, index) => {
            let option = document.createElement("option");
            option.text = example.name;
            option.value = example.code;
            exampleSelect.add(option);
        });

        exampleSelect.addEventListener("change", function () {
            if (window.codeEditor != null) {
                if(window.selectedFile === "CarlEditor") {
                    window.codeEditor.setValue(exampleSelect.value);
                }
                window.localStorage.setItem("CarlEditor", exampleSelect.value);
            }else {
                codeArea.value = exampleSelect.value;
            }
        });
    }
});
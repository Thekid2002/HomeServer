document.addEventListener("DOMContentLoaded", function () {
    let examples = [
        {
            "name": "Small for loop",
            "code": "export void _start() {\n  for (num i = 0; i < 10; i++) {\n    print(i);\n  }\n}"
        },
        {
            "name": "Big for loop",
            "code": "export void _start() {\n  num iterations = 5000000;\n  for (num i = 0; i < iterations; i=i+1) {\n    if(i < 100) {\n      print(i);\n    }\n  }\n  print(\"Total iterations: \" + iterations);\n}"
        },
        {
            "name": "Fibonacci",
            "code": "export void _start() {\n  num a = 0;\n  num b = 1;\n  num c = 0;\n  for (num i = 0; i < 10; i++) {\n    print(a);\n    c = a;\n    a = b;\n    b = c + b;\n  }\n}"
        },
        {
            "name": "Factorial",
            "code": "export void _start() {\n  num n = 5;\n  num result = 1;\n  for (num i = 1; i <= n; i++) {\n    result = result * i;\n  }\n  print(result);\n}"
        },
        {
            "name": "Fibonacci recursive",
            "code": "num fib(num n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fib(n - 1) + fib(n - 2);\n}\n\nexport void _start() {\n  for (num i = 0; i < 10; i++) {\n    print(fib(i));\n  }\n}"
        },
        {
            "name": "Simple if statement",
            "code": "export void _start() {\n  num a = 5;\n  if (a == 5) {\n    print(\"a is \" + a);\n  } else {\n    print(\"a is not 5\");\n  }\n}"
        },
        {
            "name": "Simple while loop",
            "code": "export void _start() {\n  num i = 0;\n  while (i < 10) {\n    print(i);\n    i++;\n  }\n}"
        },
        {
            "name": "Simple function",
            "code": "num add(num a, num b) {\n  return a + b;\n}\n\nexport void _start() {\n  print(add(5, 3));\n}"
        },
        {
            "name": "Scan and print num",
            "code": "export void _start() {\n  num i = 0;\n  scan(\"Enter number\", num, i);\n  print(i);\n}"
        },
        {
            "name": "Scan and print bool",
            "code": "export void _start() {\n  bool b;\n  scan(\"Enter bool\", bool, b);\n  print(b);\n}"
        },
        {
            "name": "Simple array",
            "code": "export void _start() {\n  num[5] arr = [1, 2, 3, 4, 5];\n  for (num i = 0; i < 5; i++) {\n    print(arr[i]);\n  }\n}"
        },
        {
            "name": "Simple array sum",
            "code": "export void _start() {\n  num[5] arr = [1, 2, 3, 4, 5];\n  num sum = 0;\n  for (num i = 0; i < 5; i++) {\n    sum = sum + arr[i];\n  }\n  print(sum);\n}"
        }
    ];


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
            if (codeArea != null) {
                codeArea.value = exampleSelect.value;
            }
            if (window.codeEditor != null) {
                window.codeEditor.setValue(exampleSelect.value);
            }
        });

        // Set initial value
        if (codeArea != null) {
            codeArea.value = examples[0].code;
        }

        if (window.codeEditor != null) {
            window.codeEditor.setValue(examples[0].code);
        }


    }
});
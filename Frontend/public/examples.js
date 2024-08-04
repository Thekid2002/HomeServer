document.addEventListener("DOMContentLoaded", function() {
    let examples = [
        {"name": "Small for loop", "code": "for (num i = 0; i < 10; i=i+1) {\n    print(i)\n}"},
        {"name": "Big for loop", "code": "num iterations = 5000000\nfor (num i = 0; i < 5000000; i=i+1) {\n   if(i < 100) {\n       print(i)\n   }\n}\nprint(\"Total iterations: \" + iterations)"},
        {"name": "Fibonacci", "code": "num a = 0\nnum b = 1\nnum c = 0\nfor (num i = 0; i < 10; i=i+1) {\n    print(a)\n    c = a\n    a = b\n    b = c + b\n}"},
        {"name": "Factorial", "code": "num n = 5\nnum result = 1\nfor (num i = 1; i <= n; i=i+1) {\n    result = result * i\n}\nprint(result)"},
        {"name": "Fibonacci recursive", "code": "num fib(num n) {\n    if (n <= 1) {\n        return n\n    }\n    return fib(n - 1) + fib(n - 2)\n}\n\nfor (num i = 0; i < 10; i=i+1) {\n    print(fib(i))\n}"},
        {"name": "Simple if statement", "code": "num a = 5\nif (a == 5) {\n    print(\"a is \" + a)\n} else {\n    print(\"a is not 5\")\n}"},
        {"name": "Simple while loop", "code": "num i = 0\nwhile (i < 10) {\n    print(i)\n    i = i + 1\n}"},
        {"name": "Simple function", "code": "num add(num a, num b) {\n    return a + b\n}\n\nprint(add(5, 3))"},
    ];

    let exampleSelect = document.getElementById("examples");
    let codeArea = document.getElementById("code");

    if (exampleSelect && codeArea) {
        examples.forEach((example, index) => {
            let option = document.createElement("option");
            option.text = example.name;
            option.value = example.code;
            exampleSelect.add(option);
        });

        exampleSelect.addEventListener("change", function() {
            codeArea.value = exampleSelect.value;
        });

        // Set initial value
        codeArea.value = examples[0].code;
    }
});

document.addEventListener("DOMContentLoaded", function() {
    let examples = [
        {"name": "Small for loop", "code": "for (num i = 0; i < 10; i=i+1) {\n    print(i)\n}"},
        {"name": "Big for loop", "code": "for (num i = 0; i < 50000; i=i+1) {\n    print(i)\n}"},
        {"name": "Fibonacci", "code": "num a = 0\nnum b = 1\nnum c = 0\nfor (num i = 0; i < 10; i=i+1) {\n    print(a)\n    c = a\n    a = b\n    b = c + b\n}"},
        {"name": "Factorial", "code": "num n = 5\nnum result = 1\nfor (num i = 1; i <= n; i=i+1) {\n    result = result * i\n}\nprint(result)"},
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

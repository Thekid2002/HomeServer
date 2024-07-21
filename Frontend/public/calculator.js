import {calculateViaLanguage} from "./build/debug.js";

let display = document.getElementById("numInput");
let parseOutput = document.getElementById("parseOutput");
let astOutput = document.getElementById("astOutput");
display.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        let value = JSON.parse(calculateViaLanguage(display.value));
        printParse(value.parse);
        printAst(value.ast);
        display.value = value.value;
        console.log(value);
    }
});

export function pressKey(key) {
    if(key === 'sin' || key === 'cos' || key === 'tan' || key === 'log' || key === 'sqrt') {
        return display.value += key + '(';
    }

    if (key === 'C') {
        return clearDisplay();
    }

    if (key === '=') {
        let value = JSON.parse(calculateViaLanguage(display.value));
        console.log(value);
        printParse(value.parse);
        printAst(value.ast);
        return display.value = value.value;
    }

    display.value += key.toString();
}

function printAst(ast) {
    astOutput.innerHTML = "<pre>" + "---AST---" + "</pre><br>";
    for (let i = ast.length; i > 0; i--) {
        astOutput.innerHTML += "<pre>" +  ast[i-1] + "</pre><br>";
    }
}

function printParse(parse) {
    parseOutput.innerHTML = "<pre>" + "---PARSE---" + "</pre><br>";

    for (let i = parse.length; i > 0; i--) {
       parseOutput.innerHTML += "<pre>" + parse[i-1] + "</pre><br>";
    }
}


export function clearDisplay() {
    document.getElementById("numInput").value = "";
    operator = null;
}

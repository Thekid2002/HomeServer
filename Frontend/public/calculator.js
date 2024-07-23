import {calculateViaLanguage} from "./build/debug.js";

let display = document.getElementById("numInput");
let parseOutput = document.getElementById("parseOutput");
let tokensOutput = document.getElementById("tokensOutput");
let astOutput = document.getElementById("astOutput");

let prevInputs = document.getElementById("previousInputs");
let prevInputsValues = [];
let prevInputsResults = [];
display.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calculate();
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
        return calculate();
    }

    display.value += key.toString();
}

function calculate(){
    let jsonValue;
    let input = display.value;
    try {
        jsonValue = calculateViaLanguage(input);
    }catch (e) {
        alert(e.toString());
    }
    console.log(jsonValue);
    let value = JSON.parse(jsonValue);
    inputPreviousInput(input, value.value);
    prevInputs.innerHTML = getPreviousInputsHtml();

    console.log(value);
    if(value.lexerErrors.length > 0) {
        printLexerErrors(value.lexerErrors);
    }else {
        printParse(value.parse);
    }
    if(value.parseErrors.length > 0) {
        printAstErrors(value.parseErrors);
    }else {
        printAst(value.ast);
    }
    printTokens(value.tokens);
    return display.value = value.value;
}

export function setInput(value) {
    document.getElementById("numInput").value = value;
}

function printLexerErrors(errors) {
    astOutput.innerHTML = "<pre>" + "---LEXER ERRORS---" + "</pre><br>";
    for (let i = errors.length; i > 0; i--) {
        astOutput.innerHTML += "<pre>" + errors[i-1] + "</pre><br>";
    }
}


function printAstErrors(errors) {
    parseOutput.innerHTML = "<pre>" + "---PARSE ERRORS---" + "</pre><br>";
    for (let i = errors.length; i > 0; i--) {
        parseOutput.innerHTML += "<pre>" + errors[i-1] + "</pre><br>";
    }
}

function printAst(ast) {
    astOutput.innerHTML = "<pre>" + "---AST---" + "</pre><br>";
    for (let i = ast.length; i > 0; i--) {
        astOutput.innerHTML += "<pre>" +  ast[i-1] + "</pre><br>";
    }
}

function printTokens(tokens) {
    tokensOutput.innerHTML = "<pre>" + "---TOKENS---" + "</pre><br>";

    for (let i = 0; i < tokens.length; i++) {
        tokensOutput.innerHTML += "<pre>" + tokens[i].lexeme + "</pre><br>";
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
}

function inputPreviousInput(value, result) {
    if(prevInputsValues.length >= 2) {
        prevInputsValues[2] = prevInputsValues[1];
        prevInputsResults[2] = prevInputsResults[1];
    }
    if(prevInputsValues.length >= 1) {
        prevInputsValues[1] = prevInputsValues[0];
        prevInputsResults[1] = prevInputsResults[0];
    }
    prevInputsValues[0] = value;
    prevInputsResults[0] = result;
}

function getPreviousInputsHtml(){
    let html = "";
    for (let i = Math.min(3, prevInputsValues.length); i > 0; i--) {
        html += `<button class="setInputButton" onclick="setInput('${prevInputsValues[i-1]}')"><span>${prevInputsValues[i-1]}</span> <span>=</span> <span>${prevInputsResults[i-1]}</span></button>`;
    }
    return html;
}

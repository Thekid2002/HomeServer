import {calculateViaLanguage} from "./build/debug.js";

let display = document.getElementById("numInput");
let parseOutput = document.getElementById("parseOutput");
let tokensOutput = document.getElementById("tokensOutput");
let astOutput = document.getElementById("astOutput");
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
    try {
        jsonValue = calculateViaLanguage(display.value);
    }catch (e) {
        alert(e.toString());
    }
    console.log(jsonValue);
    let value = JSON.parse(jsonValue);
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

function printLexerErrors(errors) {
    astOutput.innerHTML = "<pre>" + "---PARSE ERRORS---" + "</pre><br>";
    for (let i = errors.length; i > 0; i--) {
        astOutput.innerHTML += "<pre>" + errors[i-1] + "</pre><br>";
    }
}


function printAstErrors(errors) {
    parseOutput.innerHTML = "<pre>" + "---AST ERRORS---" + "</pre><br>";
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

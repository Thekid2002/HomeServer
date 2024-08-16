import {calculateViaLanguage} from "./build/simpleCalculator/SCDebug.js";

let display = document.getElementById("numInput");
let parseOutput = document.getElementById("parseOutput");
let tokensOutput = document.getElementById("tokensOutput");
let printOutput = document.getElementById("printOutput");
let evalOutput = document.getElementById("evalOutput");
let astOutput = document.getElementById("astOutput");
let compilerOutput = document.getElementById("compiled");
let spinner = document.getElementById("spinner");

let startTime;

let search = window.document.URL;
let query = search.split('?')[1];

console.log(query);
if(query) {
    let queryValues = query.split('&');
    let keys = [];
    let values = [];
    for (let i = 0; i < queryValues.length; i++) {
        let split = queryValues[i].split(':');
        keys.push(split[0]);
        values.push(split[1].replaceAll("%20", " "));
    }

    if (keys.includes("page")) {
        goToPage(values[keys.indexOf("page")]);
    }

    if (keys.includes("input")) {
        setInput(values[keys.indexOf("input")]);
    }

    if (keys.includes("code")) {
        display.value = values[keys.indexOf("code")];
    }


    if (keys.includes("calculate")) {
        if (values[keys.indexOf("calculate")] === "true") {
            calculate();
        }
    }
}


let prevInputs = document.getElementById("previousInputs");
let prevInputsValues = [];
let prevInputsResults = [];
display.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        calculate();
    }
});

export function pressKey(key) {
    if (key === 'sin' || key === 'cos' || key === 'tan' || key === 'log' || key === 'sqrt') {
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

function calculate() {
    startTime = Date.now();
    spinner.style.display = "flex";

    setTimeout(() => {
        let jsonValue;
        let input = display.value;
        try {
            jsonValue = calculateViaLanguage(input);
        } catch (e) {
            alert(e.toString());
            spinner.style.display = "none";
            return;
        }
        let finalTime = Date.now() - startTime;
        console.log("Time to calculate: " + finalTime + "ms");
        spinner.style.display = "none";
        console.log(jsonValue);
        if (jsonValue === undefined || jsonValue === null) {
            alert("Calculation error: JSON value is undefined or null.");
            spinner.style.display = "none";
            return;
        }

        let value;
        try {
            value = JSON.parse(jsonValue);
        } catch (e) {
            alert("Error parsing JSON: " + e.toString());
            spinner.style.display = "none";
            return;
        }

        inputPreviousInput(input, value.value);
        prevInputs.innerHTML = getPreviousInputsHtml();

        resetOutputs();

        console.log(value);
        if (value.lexerErrors && value.lexerErrors.length > 0) {
            printLexerErrors(value.lexerErrors);
        } else {
            printParse(value.parse);
        }

        if (value.parseErrors && value.parseErrors.length > 0) {
            printAstErrors(value.parseErrors);
        } else {
            printAst(value.ast);
        }

        if (value.varEnv) {
            printEval(value.varEnv);
        }

        if (value.prints) {
            printPrint(value.prints);
        }

        if (value.tokens) {
            printTokens(value.tokens);
        }

        if(value.compilerOutput){
            compilerOutput.innerHTML = value.compilerOutput
        }

        spinner.style.display = "none";
        return display.value = value.value || "Error: No value returned.";
    }, 0);  // Adjust the delay as needed
}
export function setInput(value) {
    return document.getElementById("numInput").value = value;
}

function printLexerErrors(errors) {
    astOutput.innerHTML = "<pre>" + "---LEXER ERRORS---" + "</pre><br>";
    for (let i = errors.length; i > 0; i--) {
        astOutput.innerHTML += "<pre>" + errors[i - 1] + "</pre><br>";
    }
}


function printAstErrors(errors) {
    parseOutput.innerHTML = "<pre>" + "---PARSE ERRORS---" + "</pre><br>";
    for (let i = errors.length; i > 0; i--) {
        parseOutput.innerHTML += "<pre>" + errors[i - 1] + "</pre><br>";
    }
}

function printAst(ast) {
    astOutput.innerHTML += "<pre>" + "---AST---" + "</pre><br>";
    for (let i = ast.length; i > 0; i--) {
        astOutput.innerHTML += "<pre>" + ast[i - 1] + "</pre><br>";
    }
}

function printTokens(tokens) {
    tokensOutput.innerHTML += "<pre>" + "---TOKENS---" + "</pre><br>";

    for (let i = 0; i < tokens.length; i++) {
        tokensOutput.innerHTML += "<pre>" + tokens[i].lexeme + "</pre><br>";
    }
}

function printParse(parse) {
    parseOutput.innerHTML += "<pre>" + "---PARSE---" + "</pre><br>";

    for (let i = parse.length; i > 0; i--) {
        parseOutput.innerHTML += "<pre>" + parse[i - 1] + "</pre><br>";
    }
}

function printEval(evaluation) {
    evalOutput.innerHTML += "<pre>" + "---ENV---" + "</pre><br>";
    let keys = Object.keys(evaluation);
    let values = Object.values(evaluation);

    for (let i = keys.length - 1; i >= 0; i--) {
        evalOutput.innerHTML += "<pre>" + keys[i] + " : " + values[i] + "</pre><br>";
    }
}

function printPrint(print) {
    printOutput.innerHTML += "<pre>" + "---PRINT---" + "</pre><br>";

    for (let i = Math.min(print.length, 100); i > 0; i--) {
        printOutput.innerHTML += "<pre>" + print[i - 1] + "</pre><br>";
    }
}

function resetOutputs() {
    parseOutput.innerHTML = "";
    tokensOutput.innerHTML = "";
    astOutput.innerHTML = "";
    printOutput.innerHTML = "";
    evalOutput.innerHTML = "";
}


export function clearDisplay() {
    document.getElementById("numInput").value = "";
}

function inputPreviousInput(value, result) {
    if (prevInputsValues.length >= 2) {
        prevInputsValues[2] = prevInputsValues[1];
        prevInputsResults[2] = prevInputsResults[1];
    }
    if (prevInputsValues.length >= 1) {
        prevInputsValues[1] = prevInputsValues[0];
        prevInputsResults[1] = prevInputsResults[0];
    }
    prevInputsValues[0] = value;
    prevInputsResults[0] = result;
}

function getPreviousInputsHtml() {
    let html = "";
    for (let i = Math.min(3, prevInputsValues.length); i > 0; i--) {
        html += `<button class="setInputButton" onclick="setInput('${prevInputsValues[i - 1]}')"><span>${prevInputsValues[i - 1]}</span> <span>=</span> <span>${prevInputsResults[i - 1]}</span></button>`;
    }
    return html;
}

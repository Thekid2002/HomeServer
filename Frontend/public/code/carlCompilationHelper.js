import { calculateViaLanguage } from "/build/carlCompiler/CaCoRelease.js";
let codeInput = document.getElementById("code");
let result = document.getElementById("result");
let parseErrors = [];

let worker;

function createWorker() {
    worker = new Worker("/code/worker.js");
    worker.onmessage = function (e) {
        console.log(e.data.type);
        let data = e.data;
        if (data.type.includes("addPrint")) {
            addPrint(data.text);
        }
        if (data.type.includes("handlePrintsAndOutput")) {
            handlePrintsAndOutput(data.endTime, parseErrors);
            destroyWorker();
        }
    };
}

function destroyWorker() {
    worker.terminate();
    worker = null;
    console.log("Worker terminated");
}

function addPrint(text) {
    if (window.terminal != null) {
        window.terminal.setValue(window.terminal.getValue() + text + "\n");
    } else {
        result.value += text + "\n";
    }
}

export async function compileAndExecute() {
    console.log("Compiling and executing code...");
    createWorker();
    let success = await compile();
    if (success) {
        worker.postMessage({type: "execute", wat: window.localStorage.getItem("wat"), runtimeFile: getRuntimeFile(), runtimeImportFile: getRuntimeImportFile()});
    }
}

/**
 * Compile the code input into WebAssembly and execute it.
 */
export async function compile() {
    const now = Date.now();
    let code = codeInput.value;
    if (window.codeEditor != null) {
        code = getEntryFile();
    }
    let compiledResult;
    let compiledWat;
    try {
        if (window.terminal.getValue() !== "") {
            window.terminal.setValue("");
        }
        compiledResult = await calculateViaLanguage(code, "compiler");
        console.log(compiledResult);
        // Calculate the WAT (WebAssembly Text format) using a custom language function
        const jsonRes = JSON.parse(compiledResult);
        if (jsonRes.compilerOutput !== "") {
            jsonRes.compilerOutput = jsonRes.compilerOutput.replaceAll(
                "nul!ll>",
                "\0"
            );
        } else {
            console.log(jsonRes);
        }
        compiledWat = jsonRes.compilerOutput;

        if (jsonRes.lexerErrors.length > 0) {
            let output = "";
            for (let i = 0; i < jsonRes.lexerErrors.length; i++) {
                output += jsonRes.lexerErrors[i];
                if (i < jsonRes.lexerErrors.length - 1) {
                    output += "\n";
                }
            }
            if (window.terminal != null) {
                window.terminal.setValue(window.terminal.getValue() + output);
            } else {
                result.value = output;
                console.log(jsonRes);
            }
            return false;
        }

        if (jsonRes.parseErrors.length > 0) {
            let output = "";
            for (let i = 0; i < jsonRes.parseErrors.length; i++) {
                output += jsonRes.parseErrors[i];
                if (i < jsonRes.parseErrors.length - 1) {
                    output += "\n";
                }
            }
            if (window.terminal != null) {
                //Add the output to the terminal and dont overwrite the previous output
                window.terminal.setValue(window.terminal.getValue() + output);
            } else {
                result.value += output;
                console.log(jsonRes);
            }
            return false;
        }

        if (jsonRes.combinedCheckerErrors.length > 0) {
            let output = "";
            for (let i = 0; i < jsonRes.combinedCheckerErrors.length; i++) {
                output += jsonRes.combinedCheckerErrors[i];
                if (i < jsonRes.combinedCheckerErrors.length - 1) {
                    output += "\n";
                }
            }
            if (window.terminal != null) {
                window.terminal.setValue(window.terminal.getValue() + output);
            } else {
                result.value += output;
                console.log(jsonRes);
            }
            return false;
        }

        const later = Date.now();
        if (window.terminal != null) {
            window.terminal.setValue(
                window.terminal.getValue() +
          "Time to compile: " +
          (later - now) / 1000 +
          "s\n"
            );
            console.log(jsonRes);
        } else {
            result.value += "Time to compile: " + (later - now) / 1000 + "s\n";
            console.log(jsonRes);
        }
        window.localStorage.setItem("wat", compiledWat);
        return true;
    } catch (e) {
        alert(e.toString());
    }
}

function handlePrintsAndOutput(startTime, parseErrors) {
    const endTime = Date.now();
    let output = "";
    output += "Time to run: " + (endTime - startTime) / 1000 + "s";
    for (let i = 0; i < parseErrors.length; i++) {
        output += parseErrors[i];
        if (i < parseErrors.length - 1) {
            output += "\n";
        }
    }

    if (window.terminal != null) {
        window.terminal.setValue(window.terminal.getValue() + output);
    } else {
        result.value += output;
    }
}

function getEntryFile() {
    let entryKey = window.localStorage.getItem("entry");
    if (entryKey == null) {
        alert("No entry file found");
        return;
    }

    let entryFile = window.localStorage.getItem(entryKey);
    if (entryFile == null) {
        alert("No entry file found");
        return;
    }

    return entryFile;
}

function getRuntimeFile() {
    let runtimeKey = window.localStorage.getItem("runtime");
    if (runtimeKey == null) {
        alert("No runtime file found");
        return;
    }

    let runtimeFile = window.localStorage.getItem(runtimeKey);
    if (runtimeFile == null) {
        alert("No runtime file found");
        return;
    }

    return runtimeFile;
}

function getRuntimeImportFile() {
    let runtimeImportKey = window.localStorage.getItem("runtimeImport");
    if (runtimeImportKey == null) {
        alert("No runtime import file found");
        return;
    }

    let runtimeImportFile = window.localStorage.getItem(runtimeImportKey);
    if (runtimeImportFile == null) {
        alert("No runtime import file found");
        return;
    }

    return runtimeImportFile;
}

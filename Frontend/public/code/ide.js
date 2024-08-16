import {calculateViaLanguage} from "../build/carlCompiler/CaCoDebug.js";

let codeInput = document.getElementById("code");
let result = document.getElementById("result");

let wabtInstance = null;
let features = {}; // Feature options for WabtModule
let jsonRes;

// Initialize WabtModule and store the instance
WabtModule().then(function(wabt) {
    wabtInstance = wabt;
});

function addPrint(text) {
    if(window.terminal != null){
        window.terminal.setValue(window.terminal.getValue() + text + "\n");
    }else {
        result.value += text + "\n";
    }
}

export async function compileAndExecute() {
    let success = await compile();
    if(success) {
        execute();
    }
}

/**
 * Compile the code input into WebAssembly and execute it.
 */
export async function compile() {
    const now = Date.now();
    let code = codeInput.value;
    if(window.codeEditor != null){
        code = window.localStorage.getItem("CarlEditor");
    }
    let compiledResult;
    let compiledWat;
    try {
        if(window.terminal.getValue() !== ""){
            window.terminal.setValue("");
        }
        compiledResult = await calculateViaLanguage(code, "compiler");

        // Calculate the WAT (WebAssembly Text format) using a custom language function
        jsonRes = JSON.parse(compiledResult);
        if(jsonRes.compilerOutput !== "") {
            jsonRes.compilerOutput = jsonRes.compilerOutput.replaceAll("nul!ll>", "\0");
        }else {
            console.log(jsonRes);
        }
        compiledWat = jsonRes.compilerOutput;

        if(jsonRes.lexerErrors.length > 0 ) {
            let output = "";
            for (let i = 0; i < jsonRes.lexerErrors.length; i++) {
                output += jsonRes.lexerErrors[i];
                if (i < jsonRes.lexerErrors.length - 1) {
                    output += "\n";
                }
            }
            if(window.terminal != null){
                window.terminal.setValue(window.terminal.getValue() + output);
            }else {
                result.value = output;
                console.log(jsonRes);
            }
            return false;
        }

        if(jsonRes.parseErrors.length > 0) {
            let output = "";
            for (let i = 0; i < jsonRes.parseErrors.length; i++) {
                output += jsonRes.parseErrors[i];
                if (i < jsonRes.parseErrors.length - 1) {
                    output += "\n";
                }
            }
            if(window.terminal != null){
                //Add the output to the terminal and dont overwrite the previous output
                window.terminal.setValue(window.terminal.getValue() + output);
            }else {
                result.value += output;
                console.log(jsonRes);
            }
            return false;
        }

        if(jsonRes.combinedCheckerErrors.length > 0) {
            let output = "";
            for (let i = 0; i < jsonRes.combinedCheckerErrors.length; i++) {
                output += jsonRes.combinedCheckerErrors[i];
                if (i < jsonRes.combinedCheckerErrors.length - 1) {
                    output += "\n";
                }
            }
            if(window.terminal != null) {
                window.terminal.setValue(window.terminal.getValue() + output);
            }else {
                result.value += output;
                console.log(jsonRes);
            }
            return false;
        }

        const later = Date.now();
        if(window.terminal != null){
            window.terminal.setValue(window.terminal.getValue() + "Time to compile: " + (later - now) / 1000 + "s\n");
            console.log(jsonRes);
        }else {
            result.value += "Time to compile: " + (later - now) / 1000 + "s\n";
            console.log(jsonRes);
        }
        window.localStorage.setItem("wat", compiledWat);
        return true;

    } catch (e) {
        alert(e.toString());
    }
}

async function handlePrintsAndOutput(startTime) {
    const endTime = Date.now();
    let output = "";
    output += "Time to run: " + (endTime - startTime) / 1000 + "s";
    for (let i = 0; i < jsonRes.parseErrors.length; i++) {
        output += jsonRes.parseErrors[i];
        if (i < jsonRes.parseErrors.length - 1) {
            output += "\n";
        }
    }

    if (window.terminal != null) {
        window.terminal.setValue(window.terminal.getValue() + output);
    } else {
        result.value += output;
    }
}

export async function execute() {
    try {
        let currentWat = window.localStorage.getItem("wat");
        if (currentWat == null) {
            alert("Please compile the code first");
            return;
        }

        if (currentWat === "") {
            alert("No wat code to execute");
            return;
        }
        let $output;
        try {
            $output = compileToWasm(currentWat);
        } catch (e) {
            alert("Failed to compile the code");
        }

        let functionBody = window.localStorage.getItem("CarlRuntime").replace(
            'getImportObjectFromImportObjectFile()', window.localStorage.getItem("CarlRuntimeImport"));
        functionBody = functionBody.replaceAll("console.log(", "addPrint(").replaceAll("console.error(", "addPrint(");
        let functionArguments = "output, addPrint, wasmInstance, logMemory";
        let newFunction;
        try {
            newFunction = new Function(functionArguments, `return (async function() { ${functionBody} })()`);
        } catch (e) {
            alert("Failed to create the function: " + e.toString());
        }

        const now = Date.now();
        try {
            console.log(newFunction);
            await newFunction($output, addPrint, jsonRes.wasmInstance, logMemory);
        } catch (e) {
            alert("Function error: " + e.toString());
        }

        await handlePrintsAndOutput(now);

    } catch (e) {
        alert("Execution error: " + e.toString());
    }
}

function logMemory(memory, offset) {
    const buffer = new Uint8Array(memory);
    let i = 0;
    let str = "";
    while (buffer[offset + i] !== 0) {
        str += String.fromCharCode(buffer[offset + i]);
        i++;
    }

    return str;
}


/**
 * Compile the WAT (WebAssembly Text) code into a binary WebAssembly module.
 *
 * @param {string} value - The WAT code to compile.
 * @returns {Uint8Array|null} - The compiled WebAssembly binary buffer.
 */
function compileToWasm(value) {
    if (!wabtInstance) {
        console.error("WabtModule not initialized");
        return null;
    }

    let binaryBuffer = null;
    let module = null;

    try {
        // Parse the WAT source code to a module
        module = wabtInstance.parseWat('test.wast', value, features);
        // Resolve names and validate the module
        module.resolveNames();
        module.validate(features);

        // Generate binary output
        let binaryOutput = module.toBinary({ log: true, write_debug_names: true });
        binaryBuffer = binaryOutput.buffer; // Uint8Array containing the binary data

        console.log("Wasm compilation successful.");
    } catch (e) {
        console.error("Wasm compilation failed:", e.toString());
    } finally {
        if (module) module.destroy();
    }

    return binaryBuffer; // Return the binary buffer
}

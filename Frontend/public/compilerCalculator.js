import { calculateViaLanguage } from "./build/carlCompiler/CaCoDebug.js";

let codeInput = document.getElementById("code");
let result = document.getElementById("result");

let wabtInstance = null;
let features = {}; // Feature options for WabtModule

// Initialize WabtModule and store the instance
WabtModule().then(function(wabt) {
    wabtInstance = wabt;
});

/**
 * Compile the code input into WebAssembly and execute it.
 */
export function compile() {
    let code = codeInput.value;
    let compiledResult;
    let compiledWat;
    try {
        // Calculate the WAT (WebAssembly Text format) using a custom language function
        compiledResult = calculateViaLanguage(code, "compiler");
        console.log(compiledResult);
        let jsonRes = JSON.parse(compiledResult);
        console.log(jsonRes);
        compiledWat = jsonRes.compilerOutput;

        let output = compileToWasm(compiledWat);
        let prints = [];

        WebAssembly.compile(output).then(module => {
            const importObject = {
                console: {
                    logI32: (value) =>{ prints.push(value == true ? "true" : "false") },// Define the imported 'log' function
                    logF64: (value) =>{ prints.push(value) }// Define the imported 'log' function
                }
            };

            const wasmInstance = new WebAssembly.Instance(module, importObject);
            const {_start} = wasmInstance.exports;
            const now = Date.now();
            _start();  // Call the exported _start function
            const later = Date.now();
            let output = "";
            output += "Time to run: " + (later - now) / 1000 + "s\n";
            let lineNum = 0;
            for (let i = 0; i < jsonRes.parseErrors.length; i++) {
                output += lineNum++ + ": " + jsonRes.parseErrors[i];
                if (i < jsonRes.parseErrors.length - 1) {
                    output += "\n";
                }
            }
            for (let i = 0; i < prints.length; i++) {
                output += lineNum++ + ": " + prints[i];
                if (i < prints.length - 1) {
                    output += "\n";
                }
            }
            result.value = output;
        });
    } catch (e) {
        alert(e.toString());
    }
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

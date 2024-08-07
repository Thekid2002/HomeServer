import { calculateViaLanguage } from "./build/carlCompiler/CaCoDebug.js";

let codeInput = document.getElementById("code");
let result = document.getElementById("result");
let optimizeCheckBox = document.getElementById("optimize");

let wabtInstance = null;
let features = {}; // Feature options for WabtModule
let jsonRes;
let currentWat = null;
let optimization = false;

optimizeCheckBox.addEventListener("change", function() {
    optimization = this.checked;
});

// Initialize WabtModule and store the instance
WabtModule().then(function(wabt) {
    wabtInstance = wabt;
});

/**
 * Compile the code input into WebAssembly and execute it.
 */
export function compile() {
    result.value = "";
    const now = Date.now();
    let code = codeInput.value;
    let compiledResult;
    let compiledWat;
    try {
        // Calculate the WAT (WebAssembly Text format) using a custom language function
        compiledResult = calculateViaLanguage(code, "compiler", optimization);
        console.log(compiledResult);
        jsonRes = JSON.parse(compiledResult);
        console.log(jsonRes);
        if(jsonRes.compilerOutput != null) {
            jsonRes.compilerOutput = jsonRes.compilerOutput.replaceAll("nul!ll>", "\0");
        }
        compiledWat = jsonRes.compilerOutput;

        if(jsonRes.lexerErrors.length > 0 ) {
            let output = "";
            let lineNum = 0;
            for (let i = 0; i < jsonRes.lexerErrors.length; i++) {
                output += lineNum++ + ": " + jsonRes.lexerErrors[i];
                if (i < jsonRes.lexerErrors.length - 1) {
                    output += "\n";
                }
            }
            result.value = output;
            return;
        }

        if(jsonRes.parseErrors.length > 0) {
            let output = "";
            let lineNum = 0;
            for (let i = 0; i < jsonRes.parseErrors.length; i++) {
                output += lineNum++ + ": " + jsonRes.parseErrors[i];
                if (i < jsonRes.parseErrors.length - 1) {
                    output += "\n";
                }
            }
            result.value = output;
            return;
        }

        if(jsonRes.combinedCheckerErrors.length > 0) {
            let output = "";
            let lineNum = 0;
            for (let i = 0; i < jsonRes.combinedCheckerErrors.length; i++) {
                output += lineNum++ + ": " + jsonRes.combinedCheckerErrors[i];
                if (i < jsonRes.combinedCheckerErrors.length - 1) {
                    output += "\n";
                }
            }
            result.value = output;
            return;
        }

        const later = Date.now();
        result.value = "Time to compile: " + (later - now) / 1000 + "s\n";
        result.value += compiledWat;
        currentWat = compiledWat;

    } catch (e) {
        alert(e.toString());
    }
}

export function execute(){
    try {
        if(currentWat == null){
            alert("Please compile the code first");
            return;
        }

        if(currentWat === ""){
            alert("No wat code to execute");
            return;
        }

        result.value = "";
        let output = compileToWasm(currentWat);
        let prints = [];

        let memory = new WebAssembly.Memory({initial: 1});
        WebAssembly.compile(output).then(module => {
            const importObject = {
                js: {
                    memory,
                    concat: (offset1, offset2) => {
                        // Access the memory buffer from the WebAssembly.Memory instance
                        const buffer = new Uint8Array(memory.buffer);
                        let stackPointer = wasmInstance.exports.stackPointer.value;

                        // Read from memory until a null terminator is found
                        let i = 0;
                        let string1 = "";
                        while (buffer[offset1 + i] !== 0) {
                            string1 += String.fromCharCode(buffer[offset1 + i]);
                            i++;
                        }

                        i = 0;
                        let string2 = "";
                        while (buffer[offset2 + i] !== 0) {
                            string2 += String.fromCharCode(buffer[offset2 + i]);
                            i++;
                        }

                        let str = string1 + string2 + '\0';

                        // Write the string to memory
                        for (let i = 0; i < str.length; i++) {
                            buffer[stackPointer + i] = str.charCodeAt(i);
                        }
                        wasmInstance.exports.stackPointer.value += str.length;
                        return stackPointer;
                    },
                    toStringI32: (value) => {
                        // Access the memory buffer from the WebAssembly.Memory instance
                        const buffer = new Uint8Array(memory.buffer);
                        let stackPointer = wasmInstance.exports.stackPointer.value;

                        // Convert the integer to a string
                        const str = value.toString() + '\0';

                        // Write the string to memory
                        for (let i = 0; i < str.length; i++) {
                            buffer[stackPointer + i] = str.charCodeAt(i);
                        }
                        wasmInstance.exports.stackPointer.value += str.length;
                        return stackPointer;
                    },
                    toStringF64: (value) => {
                        // Access the memory buffer from the WebAssembly.Memory instance
                        const buffer = new Uint8Array(memory.buffer);
                        let stackPointer = wasmInstance.exports.stackPointer.value;

                        // Convert the integer to a string
                        const str = value.toString() + '\0';

                        // Write the string to memory
                        for (let i = 0; i < str.length; i++) {
                            buffer[stackPointer + i] = str.charCodeAt(i);
                        }
                        wasmInstance.exports.stackPointer.value += str.length;
                        return stackPointer;
                    },
                    scanF64: (offset) => {
                        return parseFloat(prompt((logMemory(memory.buffer, offset))));
                    },
                    scanI32: (offset) => {
                        let value = prompt((logMemory(memory.buffer, offset)));
                        if(value == null){
                            return 0;
                        }
                        if(value.toLowerCase() === "true"){
                            return 1;
                        }
                        if(value.toLowerCase() === "false"){
                            return 0;
                        }
                        return !!parseInt(value);
                    },
                    scanString: (offset) => {
                        let value = prompt((logMemory(memory.buffer, offset))) + '\0';
                        if(value == null){
                            return 0;
                        }

                        let stackPointer = wasmInstance.exports.stackPointer.value;

                        const buffer = new Uint8Array(memory.buffer);
                        for (let i = 0; i < value.length; i++) {
                            buffer[stackPointer + i] = value.charCodeAt(i);
                        }
                        wasmInstance.exports.stackPointer.value += value.length;
                        return stackPointer;
                    }
                },
                console: {
                    logI32: (value) => {
                        prints.push(value == true ? "true" : "false")
                    },
                    logF64: (value) => {
                        prints.push(value)
                    },
                    logMemory: (offset) => {
                        prints.push(logMemory(memory.buffer, offset));
                    }
                }
            };

            const wasmInstance = new WebAssembly.Instance(module, importObject);
            const {_start, stackPointer} = wasmInstance.exports;
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
    }catch (e){
        alert(e.toString());
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

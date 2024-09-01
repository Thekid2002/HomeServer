importScripts('/code/libwabt.js');

let wabtInstance = null;
let features = {}; // Feature options for WabtModule

// Initialize WabtModule and store the instance
WabtModule().then(function (wabt) {
    wabtInstance = wabt;
    console.log("WabtModule initialized successfully.");
});

onmessage = async function (e) {
    let data = e.data;
    if (data.type === "execute") {
        let wat = data.wat;
        let runtimeFile = data.runtimeFile;
        let runtimeImportFile = data.runtimeImportFile;

        await execute(wat, wabtInstance, runtimeFile, runtimeImportFile, addPrint, logMemory);
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
        module = wabtInstance.parseWat("test.wast", value, features);
        // Resolve names and validate the module
        module.resolveNames();
        module.validate(features);

        // Generate binary output
        let binaryOutput = module.toBinary({ log: true, write_debug_names: true });
        binaryBuffer = binaryOutput.buffer; // Uint8Array containing the binary data

        console.log("Wasm compilation successful.");
    } catch (e) {
        postMessage({
            type: "addPrint",
            text: "Wasm compilation failed: " + e.toString(),
        });
        console.error("Wasm compilation failed:", e.toString());
    } finally {
        if (module) module.destroy();
    }

    return binaryBuffer; // Return the binary buffer
}

async function execute(currentWat, wasmInstance, runtimeFile, runtimeImportFile, addPrint, logMemory) {
    try {
        if (currentWat == null) {
            console.error("Please compile the code first");
            return;
        }

        if (currentWat === "") {
            console.error("No wat code to execute");
            return;
        }
        let $output;
        try {
            $output = compileToWasm(currentWat);
        } catch (e) {
            console.error("Failed to compile the code");
        }

        let functionBody = runtimeFile.replace(
            "getImportObjectFromImportObjectFile()",
            runtimeImportFile
        );
        functionBody = functionBody
            .replaceAll("console.log(", "addPrint(")
            .replaceAll("console.error(", "addPrint(");
        let functionArguments = "output, addPrint, wasmInstance, logMemory";
        let newFunction;
        try {
            newFunction = new Function(
                functionArguments,
                `return (async function() { ${functionBody} })()`
            );
        } catch (e) {
            console.error("Failed to create the function: " + e.toString());
        }

        const now = Date.now();
        try {
            console.log(newFunction);
            await newFunction($output, addPrint, wasmInstance, logMemory);
        } catch (e) {
            console.error("Function error: " + e.toString());
        }

        handlePrintsAndOutput(now);
    } catch (e) {
        console.error("Execution error: " + e.toString());
    }
}

function addPrint(text) {
    postMessage({
        type: "addPrint",
        text: text,
    });
}

function handlePrintsAndOutput(now) {
    postMessage({
        type: "handlePrintsAndOutput",
        endTime: now,
    });
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

import {calculateViaLanguage} from "./build/carlCompiler/CaCoDebug.js";

let codeInput = document.getElementById("code");
let resultOutput = document.getElementById("output");

/**
 * Compile the code input into WebAssembly and execute it.
 */
export function interpret() {
    let code = codeInput.value;
    let result;
    try {
        // Calculate the WAT (WebAssembly Text format) using a custom language function
        let now = Date.now();
        result = calculateViaLanguage(code, "interpreter");
        let later = Date.now();
        console.log(result);
        let jsonRes = JSON.parse(result);
        console.log(jsonRes);
        let output = ""
        let lineNum = 0;
        output += "Time to run: " + (later - now) / 1000 + "s\n";
        for (let i = 0; i < jsonRes.parseErrors.length; i++) {
            output += lineNum++ + ": " + jsonRes.parseErrors[i];
            if (i < jsonRes.parseErrors.length - 1) {
                output += "\n";
            }
        }
        for (let i = 0; i < jsonRes.interpretOutput.length; i++) {
            output += lineNum++ + ": " + jsonRes.interpretOutput[i];
            if (i < jsonRes.interpretOutput.length - 1) {
                output += "\n";
            }
        }
        resultOutput.value = output
    } catch (e) {
        alert(e.toString());
    }
}

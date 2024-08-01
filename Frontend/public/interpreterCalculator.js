import {calculateViaLanguage} from "./build/carlCompiler/CaCoDebug.js";

let codeInput = document.getElementById("input");
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
        let jsonRes = JSON.parse(result);
        console.log(jsonRes);
        let output = "";
        output += "Time to run: " + (later - now) / 1000 + "s\n";
        for (let i = 0; i < jsonRes.interpretOutput.length; i++) {
            output += i + ": " + jsonRes.interpretOutput[i];
            if (i < jsonRes.interpretOutput.length - 1) {
                output += "\n";
            }
        }
        resultOutput.value = output
    } catch (e) {
        alert(e.toString());
    }
}
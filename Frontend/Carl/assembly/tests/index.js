import {TestDeclarations} from "./testDeclarations.js";
import {calculateViaLanguage} from "../../../public/build/carl/CaDebug.js";
import assert from "assert";


export class Tests {
    static runTests() {
        console.error("---Running all tests---");

        let val = JSON.parse(calculateViaLanguage("num i = 1+1"));
        assert.strictEqual(val.varEnv["i"], 2);
        console.log(" ");
        val = JSON.parse(calculateViaLanguage("num i = 1\n" +
            "for (num x = 0; x < 10; x = x + 1) {\n" +
            "    i = i + 1\n" +
            "}"));
        assert.strictEqual(val.varEnv["i"], 11);
        console.log(" ");
        TestDeclarations.runTests()
        console.log(" ");
        console.error("---All Tests passed---");
    }
}

Tests.runTests();


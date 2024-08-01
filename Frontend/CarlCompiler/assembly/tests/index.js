import {TestDeclarations} from "./testDeclarations.js";
import {calculateViaLanguage} from "../../../public/build/carlCompiler/CaCoDebug.js";


export class Tests {
    static runTests() {
        console.error("---Running all tests---");

        console.log("Testing: num i = 1+1");
        let ret = calculateViaLanguage("num i = 1+1", "compiler");
        console.log(ret);
        console.log(" ");
        ret = calculateViaLanguage("num i = 1\n" +
            "for (num x = 0; x < 1000000000; x = x + 1) {\n" +
            "    i = i + 1" +
            "   print(i)\n" +
            "}", "compiler");
        console.log(ret);
        console.log(" ");
        TestDeclarations.runTests()
        console.log(" ");
        console.error("---All Tests passed---");
    }
}

Tests.runTests();


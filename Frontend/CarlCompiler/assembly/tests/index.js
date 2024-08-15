import {TestDeclarations} from "./testDeclarations.js";
import {calculateViaLanguage} from "../../../public/build/carlCompiler/CaCoDebug.js";


export class Tests {
    static runTests() {
        console.error("---Running all tests---");

        console.log("Testing: int i = 1+1");
        let ret = calculateViaLanguage("int i = 1+1", "compiler");
        console.log(ret);
        console.log(" ");
        let string = "num i = 1\n" +
            "for (num x = 0; x < 10; x = x + 1) {\n" +
            "    i = i + 1" +
            "   print(i)\n" +
            "}";
        console.log("Testing: " + string);
        ret = calculateViaLanguage(string, "compiler");
        console.log(ret);
        console.log(" ");
        TestDeclarations.runTests()
        console.log(" ");
        console.error("---All Tests passed---");
    }
}

Tests.runTests();


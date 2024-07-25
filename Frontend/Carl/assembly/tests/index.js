import {TestDeclarations} from "./testDeclarations.js";


export class Tests {
    static runTests() {
        console.error("---Running all tests---");
        console.log(" ");
        TestDeclarations.runTests()
        console.log(" ");
        console.error("---All Tests passed---");
    }
}
Tests.runTests();


import {ExpressionsTest} from "./expressionsTest.js";
import {ParseErrorsTest} from "./parseErrorsTest.js";

export class Tests {
    static runTests() {
        console.error("---Running all tests---");
        ExpressionsTest.runTests();
        console.log(" ");
        ParseErrorsTest.runTests();
        console.log(" ");
        console.error("---All Tests passed---");
    }
}
Tests.runTests();


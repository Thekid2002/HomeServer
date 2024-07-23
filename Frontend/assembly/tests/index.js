import assert from "assert";
import {calculate} from "../../public/build/debug.js";
import {ExpressionsTest} from "./expressionsTest.js";
import {ParseErrorsTest} from "./parseErrorsTest.js";

export class Tests {
    static runTests() {
        console.error("---Running all tests---");
        this.testCalculate();
        ExpressionsTest.runTests();
        console.log(" ");
        ParseErrorsTest.runTests();
        console.log(" ");
        console.error("---All Tests passed---");
    }

    static testCalculate() {
        assert.strictEqual(calculate(1, 2, "+"), 3);
    }




}
Tests.runTests();


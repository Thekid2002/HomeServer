import assert from "assert";
import {calculate} from "../../public/build/debug.js";
import {ExpressionsTest} from "./expressionsTest.js";

export class Tests {
    static runTests() {
        console.log("Running tests");
        this.testCalculate();
        ExpressionsTest.runTests();
        console.log("Tests passed");
    }

    static testCalculate() {
        assert.strictEqual(calculate(1, 2, "+"), 3);
    }




}
Tests.runTests();


import assert from "assert";
import {calculate} from "../public/build/debug.js";
assert.strictEqual(calculate(1, 2, "+"), 3);
console.log("Tests pass!");

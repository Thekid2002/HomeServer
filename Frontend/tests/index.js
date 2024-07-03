import assert from "assert";
import {add, subtract, power, remainder, divide, multiply} from "../public/build/debug.js";
assert.strictEqual(add(1, 2), 3);
assert.strictEqual(subtract(1, 2), -1);
assert.strictEqual(power(2, 9), 512);
assert.strictEqual(remainder(2, 2), 0);
assert.strictEqual(divide(2,2), 1);
assert.strictEqual(multiply(10, 2), 20);
console.log("Tests pass!");

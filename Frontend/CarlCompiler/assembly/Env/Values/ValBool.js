"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValBool = void 0;
const ValObject_1 = require("./ValObject");
class ValBool extends ValObject_1.ValObject {
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return this.value.toString();
    }
    toJsonString() {
        return this.value.toString();
    }
}
exports.ValBool = ValBool;

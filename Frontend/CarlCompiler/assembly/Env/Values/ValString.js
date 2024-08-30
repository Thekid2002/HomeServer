"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValString = void 0;
const ValObject_1 = require("./ValObject");
class ValString extends ValObject_1.ValObject {
    constructor(value) {
        super();
        this.value = value;
    }
    toString() {
        return this.value;
    }
    toJsonString() {
        return this.value;
    }
}
exports.ValString = ValString;

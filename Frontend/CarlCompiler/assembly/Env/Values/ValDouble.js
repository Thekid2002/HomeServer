"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValDouble = void 0;
const ValObject_1 = require("./ValObject");
class ValDouble extends ValObject_1.ValObject {
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
exports.ValDouble = ValDouble;

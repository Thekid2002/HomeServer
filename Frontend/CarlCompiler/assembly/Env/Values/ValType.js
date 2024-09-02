"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValType = void 0;
const ValObject_1 = require("./ValObject");
class ValType extends ValObject_1.ValObject {
    constructor(type) {
        super();
        this.type = type;
    }
    toString() {
        return "type";
    }
    toJsonString() {
        return "type";
    }
}
exports.ValType = ValType;

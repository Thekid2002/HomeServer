"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseBool = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseBool extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum);
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitBool(this);
    }
    toJsonString() {
        return `{"type": "Bool", "value": ${this.value.toJsonString()}}`;
    }
}
exports.ParseBool = ParseBool;

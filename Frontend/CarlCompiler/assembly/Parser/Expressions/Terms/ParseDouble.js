"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseDouble = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseDouble extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum);
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitDouble(this);
    }
    toJsonString() {
        return `{"type": "Double", "value": ${this.value.toJsonString()}}`;
    }
}
exports.ParseDouble = ParseDouble;

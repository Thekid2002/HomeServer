"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseString = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseString extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum);
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitString(this);
    }
    toJsonString() {
        return `{"type": "String", "value": ${this.value.toJsonString()}}`;
    }
}
exports.ParseString = ParseString;

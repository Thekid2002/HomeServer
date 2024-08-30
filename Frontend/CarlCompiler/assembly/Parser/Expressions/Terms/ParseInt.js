"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseInt = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseInt extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum);
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitInt(this);
    }
    toJsonString() {
        return `{"type": "Int", "value": ${this.value.toJsonString()}}`;
    }
}
exports.ParseInt = ParseInt;

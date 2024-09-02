"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseTerm = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseTerm extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum);
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitTerm(this);
    }
    toJsonString() {
        return `{"type": "Term", "value": "${this.value}"}`;
    }
}
exports.ParseTerm = ParseTerm;

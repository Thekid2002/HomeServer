"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASTString = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ASTString extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum, value);
        this.memoryLocation = 0;
    }
    accept(visitor) {
        return visitor.visitString(this);
    }
    toJsonString() {
        return `{"type": "String", "value": "${this.value}"}`;
    }
    clone() {
        return new ASTString(this.value, this.lineNum);
    }
    toString() {
        return "ASTString(" + this.value + ")";
    }
}
exports.ASTString = ASTString;

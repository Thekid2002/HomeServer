"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Term = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class Term extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum, value);
    }
    accept(visitor) {
        return visitor.visitTerm(this);
    }
    clone() {
        return new Term(this.value, this.lineNum);
    }
    toString() {
        return "Term(" + this.value + ")";
    }
}
exports.Term = Term;

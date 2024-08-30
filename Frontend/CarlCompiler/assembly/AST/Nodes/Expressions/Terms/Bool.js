"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bool = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class Bool extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum, value);
    }
    accept(visitor) {
        return visitor.visitBool(this);
    }
    clone() {
        return new Bool(this.value, this.lineNum);
    }
    toString() {
        return "Bool(" + this.value + ")";
    }
}
exports.Bool = Bool;

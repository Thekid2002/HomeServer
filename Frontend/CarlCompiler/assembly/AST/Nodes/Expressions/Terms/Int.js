"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Int = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class Int extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum, value);
    }
    accept(visitor) {
        return visitor.visitInt(this);
    }
    clone() {
        return new Int(this.value, this.lineNum);
    }
    toString() {
        return "Int(" + this.value + ")";
    }
}
exports.Int = Int;

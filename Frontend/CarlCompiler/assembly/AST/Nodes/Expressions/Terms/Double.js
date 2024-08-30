"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Double = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class Double extends AbstractTerm_1.AbstractTerm {
    constructor(value, lineNum) {
        super(lineNum, value);
    }
    accept(visitor) {
        return visitor.visitDouble(this);
    }
    clone() {
        return new Double(this.value, this.lineNum);
    }
    toString() {
        return "Double(" + this.value + ")";
    }
}
exports.Double = Double;

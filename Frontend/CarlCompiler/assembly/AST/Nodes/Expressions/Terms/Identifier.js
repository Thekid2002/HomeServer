"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identifier = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class Identifier extends AbstractTerm_1.AbstractTerm {
    constructor(name, lineNum) {
        super(lineNum, name);
    }
    accept(visitor) {
        return visitor.visitIdentifier(this);
    }
    clone() {
        return new Identifier(this.value, this.lineNum);
    }
    toString() {
        return "Identifier(" + this.value + ")";
    }
}
exports.Identifier = Identifier;

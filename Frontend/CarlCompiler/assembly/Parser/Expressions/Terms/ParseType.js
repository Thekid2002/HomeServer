"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseType = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseType extends AbstractTerm_1.AbstractTerm {
    constructor(name, lineNum) {
        super(lineNum);
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitType(this);
    }
    toJsonString() {
        return `{"type": "Type", "name": ${this.name.toJsonString()}}`;
    }
}
exports.ParseType = ParseType;

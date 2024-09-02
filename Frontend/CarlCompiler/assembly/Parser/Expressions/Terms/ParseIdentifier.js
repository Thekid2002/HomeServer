"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseIdentifier = void 0;
const AbstractTerm_1 = require("./AbstractTerm");
class ParseIdentifier extends AbstractTerm_1.AbstractTerm {
    constructor(name, lineNum) {
        super(lineNum);
        this.name = name;
    }
    accept(visitor) {
        return visitor.visitIdentifier(this);
    }
    toJsonString() {
        return `{"type": "Identifier", "name": ${this.name.toJsonString()}}`;
    }
}
exports.ParseIdentifier = ParseIdentifier;

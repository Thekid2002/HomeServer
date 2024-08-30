"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseAssignment = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseAssignment extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(identifier, expression, lineNum) {
        super(lineNum);
        this.identifier = identifier;
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitAssignment(this);
    }
    toJsonString() {
        return `{"type": "Assignment", "identifier": "${this.identifier.name.literal}", "expression": "${this.expression.toJsonString()}"}`;
    }
}
exports.ParseAssignment = ParseAssignment;

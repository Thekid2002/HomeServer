"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseCompoundStatement = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseCompoundStatement extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(left, right, lineNum) {
        super(lineNum);
        this.left = left;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitCompoundStatement(this);
    }
    toJsonString() {
        return `{"type": "CompoundStatement", "left": ${this.left.toJsonString()}, "right": ${this.right.toJsonString()}, "lineNum": ${this.lineNum}}`;
    }
}
exports.ParseCompoundStatement = ParseCompoundStatement;

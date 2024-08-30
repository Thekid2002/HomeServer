"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseLoopStatement = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseLoopStatement extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(initiator, condition, body, lineNum) {
        super(lineNum);
        this.condition = condition;
        this.body = body;
        this.initiator = initiator;
    }
    accept(visitor) {
        return visitor.visitLoopStatement(this);
    }
    toJsonString() {
        return `{"type": "LoopStatement", "expression": ${this.condition.toJsonString()}, "body": ${this.body.toJsonString()}}`;
    }
}
exports.ParseLoopStatement = ParseLoopStatement;

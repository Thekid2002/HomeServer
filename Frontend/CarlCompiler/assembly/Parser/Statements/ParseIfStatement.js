"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseIfStatement = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseIfStatement extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(condition, body, $else, lineNum) {
        super(lineNum);
        this.condition = condition;
        this.body = body;
        this.else = $else;
    }
    accept(visitor) {
        return visitor.visitIfStatement(this);
    }
    toJsonString() {
        return `{"type": "IfStatement", "condition": ${this.condition.toJsonString()}, "body": ${this.body === null ? "null" : this.body.toJsonString()}, "else": ${this.else === null ? "null" : this.else.toJsonString()}, "lineNum": ${this.lineNum}}`;
    }
}
exports.ParseIfStatement = ParseIfStatement;

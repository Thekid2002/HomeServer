"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseUnaryExpression = void 0;
const ParseAbstractExpression_1 = require("./ParseAbstractExpression");
class ParseUnaryExpression extends ParseAbstractExpression_1.ParseAbstractExpression {
    constructor(operator, primaryOrRight, lineNum) {
        super(lineNum);
        this.operator = operator;
        this.primaryOrRight = primaryOrRight;
    }
    accept(visitor) {
        return visitor.visitUnaryExpression(this);
    }
    toJsonString() {
        return `{"type": "UnaryExpression", "operator": ${this.operator ? this.operator.toJsonString() : "\"\""}, "primaryOrRight": ${this.primaryOrRight.toJsonString()}}`;
    }
}
exports.ParseUnaryExpression = ParseUnaryExpression;

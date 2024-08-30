"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseExpression = void 0;
const ParseAbstractExpression_1 = require("./ParseAbstractExpression");
class ParseExpression extends ParseAbstractExpression_1.ParseAbstractExpression {
    constructor(primaryOrLeft, operator, right, lineNum) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitExpression(this);
    }
    toJsonString() {
        return (`{"type": "Expression", "primaryOrLeft": ${this.primaryOrLeft.toJsonString()},` +
            `operator": ${this.operator ? this.operator.toJsonString() : "\"\""},` +
            `"right": ${this.right ? this.right.toJsonString() : "\"\""}}`);
    }
}
exports.ParseExpression = ParseExpression;

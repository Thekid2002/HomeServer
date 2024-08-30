"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryExpression = void 0;
const AbstractExpression_1 = require("./AbstractExpression");
class BinaryExpression extends AbstractExpression_1.AbstractExpression {
    constructor(primaryOrLeft, operator, right, lineNum) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpression(this);
    }
    clone() {
        return new BinaryExpression(this.primaryOrLeft.clone(), this.operator, this.right.clone(), this.lineNum);
    }
    toString() {
        return ("BinaryExpression(" +
            this.primaryOrLeft.toString() +
            ", " +
            this.operator +
            ", " +
            this.right.toString() +
            ")");
    }
}
exports.BinaryExpression = BinaryExpression;

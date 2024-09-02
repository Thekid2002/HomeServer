"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryExpression = void 0;
const AbstractExpression_1 = require("./AbstractExpression");
class UnaryExpression extends AbstractExpression_1.AbstractExpression {
    constructor(operator, primaryOrRight, lineNum) {
        super(lineNum);
        this.operator = operator;
        this.primaryOrRight = primaryOrRight;
    }
    accept(visitor) {
        return visitor.visitUnaryExpression(this);
    }
    clone() {
        return new UnaryExpression(this.operator, this.primaryOrRight.clone(), this.lineNum);
    }
    toString() {
        return ("UnaryExpression(" +
            this.operator +
            ", " +
            this.primaryOrRight.toString() +
            ")");
    }
}
exports.UnaryExpression = UnaryExpression;

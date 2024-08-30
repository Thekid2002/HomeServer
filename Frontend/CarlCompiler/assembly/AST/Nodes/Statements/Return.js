"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class Return extends AbstractStatement_1.AbstractStatement {
    constructor(expression, lineNum) {
        super(lineNum);
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitReturn(this);
    }
    clone() {
        return new Return(this.expression.clone(), this.lineNum);
    }
    toString() {
        return "Return(" + this.expression.toString() + ")";
    }
}
exports.Return = Return;

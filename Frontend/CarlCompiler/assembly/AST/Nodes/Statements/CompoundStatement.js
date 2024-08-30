"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundStatement = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class CompoundStatement extends AbstractStatement_1.AbstractStatement {
    constructor(left, right, line) {
        super(line);
        this.left = left;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitCompoundStatement(this);
    }
    clone() {
        return new CompoundStatement(this.left.clone(), this.right.clone(), this.lineNum);
    }
    toString() {
        return ("CompoundStatement(" +
            this.left.toString() +
            ", " +
            this.right.toString() +
            ")");
    }
}
exports.CompoundStatement = CompoundStatement;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assignment = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class Assignment extends AbstractStatement_1.AbstractStatement {
    constructor(identifier, expression, lineNum) {
        super(lineNum);
        this.identifier = identifier;
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitAssignment(this);
    }
    clone() {
        return new Assignment(this.identifier.clone(), this.expression.clone(), this.lineNum);
    }
    toString() {
        return ("Assignment(" +
            this.identifier.toString() +
            ", " +
            this.expression.toString() +
            ")");
    }
}
exports.Assignment = Assignment;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfStatement = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class IfStatement extends AbstractStatement_1.AbstractStatement {
    constructor(condition, body, $else, line) {
        super(line);
        this.condition = condition;
        this.body = body;
        this.else = $else;
    }
    accept(visitor) {
        return visitor.visitIfStatement(this);
    }
    clone() {
        let $if = new IfStatement(this.condition.clone(), this.body !== null ? this.body.clone() : null, this.else !== null ? this.else.clone() : null, this.lineNum);
        return $if;
    }
    toString() {
        return ("IfStatement(" +
            this.condition.toString() +
            ", " +
            (this.body !== null ? this.body.toString() : "null") +
            ", " +
            (this.else !== null ? this.else.toString() : "null") +
            ")");
    }
}
exports.IfStatement = IfStatement;

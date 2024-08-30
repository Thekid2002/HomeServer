"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class While extends AbstractStatement_1.AbstractStatement {
    constructor(initiator, condition, body, lineNum) {
        super(lineNum);
        this.condition = condition;
        this.body = body;
        this.initiator = initiator;
    }
    accept(visitor) {
        return visitor.visitWhile(this);
    }
    clone() {
        let $while = new While(this.initiator !== null ? this.initiator.clone() : null, this.condition.clone(), this.body !== null ? this.body.clone() : null, this.lineNum);
        return $while;
    }
    toString() {
        return ("While(" +
            (this.initiator !== null ? this.initiator.toString() : "null") +
            ", " +
            this.condition.toString() +
            ", " +
            (this.body !== null ? this.body.toString() : "null") +
            ")");
    }
}
exports.While = While;

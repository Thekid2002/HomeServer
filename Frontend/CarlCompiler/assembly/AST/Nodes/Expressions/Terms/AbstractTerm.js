"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTerm = void 0;
const AbstractExpression_1 = require("../AbstractExpression");
class AbstractTerm extends AbstractExpression_1.AbstractExpression {
    constructor(lineNum, value) {
        super(lineNum);
        this.value = value;
    }
}
exports.AbstractTerm = AbstractTerm;

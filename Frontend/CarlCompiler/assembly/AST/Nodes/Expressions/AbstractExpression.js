"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractExpression = void 0;
const AbstractNode_1 = require("../AbstractNode");
class AbstractExpression extends AbstractNode_1.AbstractNode {
    constructor() {
        super(...arguments);
        this.type = null;
    }
}
exports.AbstractExpression = AbstractExpression;

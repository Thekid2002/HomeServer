"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseReturn = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseReturn extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(expression, lineNum) {
        super(lineNum);
        this.expression = expression;
    }
    toJsonString() {
        let string = "{\n";
        string += "\"type\": \"Return\",\n";
        string += "\"expression\": " + this.expression.toJsonString() + ",\n";
        string += "\"line\": " + this.lineNum + "\n";
        string += "}";
        return string;
    }
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}
exports.ParseReturn = ParseReturn;

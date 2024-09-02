"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseProgram = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseProgram extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(body, lineNum) {
        super(lineNum);
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitProgram(this);
    }
    toJsonString() {
        return `{"type": "Program", "body": ${this.body !== null ? this.body.toJsonString() : "null"}}`;
    }
}
exports.ParseProgram = ParseProgram;

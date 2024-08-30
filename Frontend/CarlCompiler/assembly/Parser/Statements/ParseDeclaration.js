"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParseDeclaration = void 0;
const ParseAbstractStatement_1 = require("./ParseAbstractStatement");
class ParseDeclaration extends ParseAbstractStatement_1.ParseAbstractStatement {
    constructor(identifier, type, expression, $export, global, lineNum) {
        super(lineNum);
        this.identifier = identifier;
        this.type = type;
        this.expression = expression;
        this.export = $export;
        this.global = global;
    }
    accept(visitor) {
        return visitor.visitDeclaration(this);
    }
    toJsonString() {
        return (`{"type": "Declaration", "identifier": ${this.identifier.toJsonString()},` +
            `"type": ${this.type.toJsonString()},` +
            `"export": ${this.export},` +
            `"expression": ${this.expression ? this.expression.toJsonString() : "\"\""}}`);
    }
}
exports.ParseDeclaration = ParseDeclaration;

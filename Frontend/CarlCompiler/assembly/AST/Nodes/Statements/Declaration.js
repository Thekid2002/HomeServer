"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Declaration = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class Declaration extends AbstractStatement_1.AbstractStatement {
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
    clone() {
        return new Declaration(this.identifier.clone(), this.type, this.expression == null
            ? null
            : this.expression.clone(), this.export, this.global, this.lineNum);
    }
    toString() {
        return ("Declaration(" +
            this.identifier.toString() +
            ", " +
            this.type.toString() +
            (this.expression == null ? "" : ", " + this.expression.toString()) +
            ")");
    }
}
exports.Declaration = Declaration;

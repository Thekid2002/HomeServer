"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = void 0;
const AbstractStatement_1 = require("./AbstractStatement");
class Program extends AbstractStatement_1.AbstractStatement {
    constructor(body, lineNum) {
        super(lineNum);
        this.varEnv = null;
        this.body = body;
    }
    accept(visitor) {
        return visitor.visitProgram(this);
    }
    clone() {
        return new Program(this.body !== null ? this.body.clone() : null, this.lineNum);
    }
    toString() {
        return ("Program(" + (this.body !== null ? this.body.toString() : "null") + ")");
    }
}
exports.Program = Program;

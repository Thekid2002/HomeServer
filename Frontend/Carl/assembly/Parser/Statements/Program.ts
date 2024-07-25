import { ParseVisitor } from "../ParseVisitor";
import {AbstractStatement} from "./AbstractStatement";

export class Program extends AbstractStatement {
    statement: AbstractStatement;

    constructor(statement: AbstractStatement, lineNum: i32) {
        super(lineNum);
        this.statement = statement;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitProgram(this);
    }

    toJsonString(): string {
        return `{"type": "Program", "statement": ${this.statement.toJsonString()}}`;
    }
}

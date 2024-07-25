import {AbstractStatement} from "./AbstractStatement";
import {ASTVisitor} from "../../ASTVisitor";

export class Program extends AbstractStatement {
    statement: AbstractStatement;

    constructor(statement: AbstractStatement, lineNum: i32) {
        super(lineNum);
        this.statement = statement;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitProgram(this);
    }
}

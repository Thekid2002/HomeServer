import {AbstractStatement} from "./AbstractStatement";
import {ASTVisitor} from "../../ASTVisitor";

export class Program extends AbstractStatement {
    body: Array<AbstractStatement>;

    constructor(statement: Array<AbstractStatement>, lineNum: i32) {
        super(lineNum);
        this.body = statement;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitProgram(this);
    }
}

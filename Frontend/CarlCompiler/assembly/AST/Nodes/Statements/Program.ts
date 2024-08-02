import {AbstractStatement} from "./AbstractStatement";
import {ASTVisitor} from "../../ASTVisitor";

export class Program extends AbstractStatement {
    body: AbstractStatement | null;

    constructor(body: AbstractStatement | null, lineNum: i32) {
        super(lineNum);
        this.body = body;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitProgram(this);
    }
}

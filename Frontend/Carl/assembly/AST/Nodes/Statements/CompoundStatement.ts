import {AbstractStatement} from "./AbstractStatement";
import {ASTVisitor} from "../../ASTVisitor";

export class CompoundStatement extends AbstractStatement
{
    left: AbstractStatement;
    right: AbstractStatement;

    constructor(left: AbstractStatement, right: AbstractStatement, lineNum: i32)
    {
        super(lineNum);
        this.left = left;
        this.right = right;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitCompoundStatement(this);
    }


}

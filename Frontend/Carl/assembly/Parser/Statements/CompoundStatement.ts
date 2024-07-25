import {AbstractStatement} from "./AbstractStatement";
import {ParseVisitor} from "../ParseVisitor";

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

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitCompoundStatement(this);
    }

    toJsonString(): string {
        return `{"type": "CompoundStatement", "left": ${this.left.toJsonString()}, "right": ${this.right.toJsonString()}}`;
    }
}

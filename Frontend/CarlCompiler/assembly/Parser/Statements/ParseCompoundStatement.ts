import { ParseAbstractStatement } from "./ParseAbstractStatement";
import { ParseVisitor } from "../ParseVisitor";

export class ParseCompoundStatement extends ParseAbstractStatement {
    left: ParseAbstractStatement;
    right: ParseAbstractStatement;

    constructor(
        left: ParseAbstractStatement,
        right: ParseAbstractStatement,
        lineNum: i32
    ) {
        super(lineNum);
        this.left = left;
        this.right = right;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitCompoundStatement(this);
    }

    toJsonString(): string {
        return `{"type": "CompoundStatement", "left": ${this.left.toJsonString()}, "right": ${this.right.toJsonString()}, "lineNum": ${this.lineNum}}`;
    }
}

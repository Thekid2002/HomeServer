import { AbstractStatement } from "./AbstractStatement";
import { ASTVisitor } from "../../ASTVisitor";

export class CompoundStatement extends AbstractStatement {
    left: AbstractStatement;
    right: AbstractStatement;

    constructor(left: AbstractStatement, right: AbstractStatement, line: i32) {
        super(line);
        this.left = left;
        this.right = right;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitCompoundStatement(this);
    }

    clone(): CompoundStatement {
        return new CompoundStatement(
      this.left.clone() as AbstractStatement,
      this.right.clone() as AbstractStatement,
      this.lineNum
        );
    }

    toString(): string {
        return (
            "CompoundStatement(" +
      this.left.toString() +
      ", " +
      this.right.toString() +
      ")"
        );
    }
}

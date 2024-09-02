import { AbstractExpression } from "./AbstractExpression";
import { ASTVisitor } from "../../ASTVisitor";

export class BinaryExpression extends AbstractExpression {
    primaryOrLeft: AbstractExpression;
    operator: string;
    right: AbstractExpression;

    constructor(
        primaryOrLeft: AbstractExpression,
        operator: string,
        right: AbstractExpression,
        lineNum: i32
    ) {
        super(lineNum);
        this.primaryOrLeft = primaryOrLeft;
        this.operator = operator;
        this.right = right;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitBinaryExpression(this);
    }

    clone(): BinaryExpression {
        return new BinaryExpression(
      this.primaryOrLeft.clone() as AbstractExpression,
      this.operator,
      this.right.clone() as AbstractExpression,
      this.lineNum
        );
    }

    toString(): string {
        return (
            "BinaryExpression(" +
      this.primaryOrLeft.toString() +
      ", " +
      this.operator +
      ", " +
      this.right.toString() +
      ")"
        );
    }
}

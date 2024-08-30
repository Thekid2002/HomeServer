import { AbstractExpression } from "./AbstractExpression";
import { ASTVisitor } from "../../ASTVisitor";

export class UnaryExpression extends AbstractExpression {
    operator: string;
    primaryOrRight: AbstractExpression;

    constructor(
        operator: string,
        primaryOrRight: AbstractExpression,
        lineNum: i32
    ) {
        super(lineNum);
        this.operator = operator;
        this.primaryOrRight = primaryOrRight;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitUnaryExpression(this);
    }

    clone(): UnaryExpression {
        return new UnaryExpression(
            this.operator,
      this.primaryOrRight.clone() as AbstractExpression,
      this.lineNum
        );
    }

    toString(): string {
        return (
            "UnaryExpression(" +
      this.operator +
      ", " +
      this.primaryOrRight.toString() +
      ")"
        );
    }
}

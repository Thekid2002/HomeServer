import { ASTVisitor } from "../../ASTVisitor";
import { AbstractNode } from "../AbstractNode";
import { AbstractStatement } from "./AbstractStatement";
import { AbstractExpression } from "../Expressions/AbstractExpression";

export class Return extends AbstractStatement {
    public expression: AbstractExpression;

    constructor(expression: AbstractExpression, lineNum: i32) {
        super(lineNum);
        this.expression = expression;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitReturn(this);
    }
    clone(): AbstractNode {
        return new Return(
      this.expression.clone() as AbstractExpression,
      this.lineNum
        );
    }
    toString(): string {
        return "Return(" + this.expression.toString() + ")";
    }
}

import { Identifier } from "../Expressions/Terms/Identifier";
import { AbstractStatement } from "./AbstractStatement";
import { AbstractExpression } from "../Expressions/AbstractExpression";
import { ASTVisitor } from "../../ASTVisitor";

export class Assignment extends AbstractStatement {
    identifier: Identifier;
    expression: AbstractExpression;

    constructor(
        identifier: Identifier,
        expression: AbstractExpression,
        lineNum: i32
    ) {
        super(lineNum);
        this.identifier = identifier;
        this.expression = expression;
    }

    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitAssignment(this);
    }

    clone(): Assignment {
        return new Assignment(
      this.identifier.clone() as Identifier,
      this.expression.clone() as AbstractExpression,
      this.lineNum
        );
    }

    toString(): string {
        return (
            "Assignment(" +
      this.identifier.toString() +
      ", " +
      this.expression.toString() +
      ")"
        );
    }
}

import {AbstractStatement} from "./AbstractStatement";
import {AbstractExpression} from "../Expressions/AbstractExpression";
import {ASTVisitor} from "../../ASTVisitor";
import {ValueType} from "../Types/ValueType";

export class Print extends AbstractStatement {
    expression: AbstractExpression;

    constructor(expression: AbstractExpression, lineNum: i32) {
        super(lineNum);
        this.expression = expression;
    }


    accept<T>(visitor: ASTVisitor<T>): T {
        return visitor.visitPrint(this);
    }

    clone(): Print {
        return new Print(
            this.expression.clone() as AbstractExpression,
            this.lineNum
        );
    }

    toString(): string {
        return "Print(" + this.expression.toString() + ")";
    }
}

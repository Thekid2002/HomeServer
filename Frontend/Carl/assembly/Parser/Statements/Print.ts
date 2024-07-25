import {AbstractExpression} from "../Expressions/AbstractExpression";
import {AbstractStatement} from "./AbstractStatement";
import {ParseVisitor} from "../ParseVisitor";

export class Print extends AbstractStatement {
    expression: AbstractExpression;

    constructor(expression: AbstractExpression, lineNum: i32) {
        super(lineNum);
        this.expression = expression;
    }

    accept<T>(visitor: ParseVisitor<T>): T {
        return visitor.visitPrint(this);
    }

    toJsonString(): string {
        return `{"type": "Print", "expression": ${this.expression.toJsonString()}}`;
    }
}

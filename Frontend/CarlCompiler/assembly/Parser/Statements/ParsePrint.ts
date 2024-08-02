import {ParseAbstractExpression} from "../Expressions/ParseAbstractExpression";
import {ParseAbstractStatement} from "./ParseAbstractStatement";
import {ParseVisitor} from "../ParseVisitor";

export class ParsePrint extends ParseAbstractStatement {
    expression: ParseAbstractExpression;

    constructor(expression: ParseAbstractExpression, lineNum: i32) {
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
